import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { UserDTO } from '../dto/responses/user.response';
import { loginInput } from '../validators/auth.validators';
import client from '../config/redisClient';
import { nanoid } from 'nanoid';

interface signupResponse {
    user: UserDTO;
    accessToken: string;
    refreshToken: string;
}

const secret = String(process.env.JWT_SECRET);
const refreshSecret = String(process.env.JW_REFRESH_SECRET);

export class AuthService {



    static async signUp (
        {username, password, email, deviceName, ip}:
         {username: string; password: string; email: string; deviceName: string; ip: string | undefined}
        ): Promise<signupResponse>{
        
        const hashed_password = await bcrypt.hash(password, 12)
        const connection = await pool.getConnection()
        
        try {

        await connection.beginTransaction()

        await connection.execute<ResultSetHeader>(
            `INSERT INTO users (username, hashed_password, email)
            VALUES(?, ?, ?)`,
            [username, hashed_password, email]
        )
        const [rows] = await connection.execute<any[]>(
            `SELECT user_id, username, email, role
            FROM users
            WHERE email = ?`, 
            [email])

        const user: UserDTO = rows[0];

        const accessToken = jwt.sign(
            {userId: user.user_id, role: user.role},
            secret,
            {expiresIn: process.env.JWT_EXPIRES_IN as any}
        )
        const refreshToken = jwt.sign(
            {userId: user.user_id, role: user.role},
            refreshSecret,
            {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any}
        )
        const sessionId = nanoid()
        const sessionData = {
            token: refreshToken,
            deviceName,
            ip,
            createdAt: Date.now()
        }

        await client.multi()
        .set(`token_to_session:${refreshToken}`, sessionId, {EX: 7 * 24 * 60 * 60})
        .hSet(`sessions:${user.user_id}`, sessionId, JSON.stringify(sessionData) )
        .expire(`sessions:${user.user_id}`, 7 * 24 * 60 * 60)
        .exec()
        
        // await connection.execute<ResultSetHeader>(
        //     `INSERT INTO refresh_tokens (user_id, token)
        //     VALUES(?, ?)`,
        //     [user.user_id, refreshToken]
        // )

        await connection.commit()
        return {user, accessToken, refreshToken}
    }catch(err){
        await connection.rollback()
        throw err
    }finally{
        connection.release()
    }
    }





    static async login({username, password, deviceName, ip}: loginInput & { deviceName: string, ip: string | undefined }):Promise<signupResponse> {
        //Fetch user from DB
        const [rows] = await pool.execute<UserDTO[] & RowDataPacket[]>(
            `SELECT user_id, username, email, role, hashed_password
            FROM users
            WHERE username = ?`,
            [username]
        )
        const dbUser = rows[0]

        //Initial check
        if(!dbUser){
            const err = new Error('invalid username or password') as Error & { statusCode: number }
            err.statusCode = 401
            throw err;
        }
        //Destructure to separate the hash from the data we want to return
        const {hashed_password, ...user} = dbUser
        user as UserDTO
        //Verify password
        const passwordValid = await bcrypt.compare(password, hashed_password)
        if(!passwordValid){
            const err = new Error('invalid username  or password') as Error & {statusCode: number}
            err.statusCode = 401
            throw err;
        }
        //Generate JWTs
        const accessToken = jwt.sign({userId: user.user_id, role: user.role}, secret, {expiresIn: process.env.JWT_EXPIRES_IN as any})
        const refreshToken = jwt.sign({userId: user.user_id, role: user.role}, refreshSecret, {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any})
        const sessionId = nanoid()
        const sessionData = {
            token: refreshToken,
            deviceName,
            ip,
            createdAt: Date.now()
        }

        //insert token into db
        await client.multi()
        .set(`token_tosession:${refreshToken}`, sessionId, {EX: 7 * 24 * 60 * 60})
        .hSet(`sessions:${user.user_id}`, sessionId, JSON.stringify(sessionData))
        .expire(`sessions:${user.user_id}`, 7 * 24 * 60 * 60)
        .exec()

        // await pool.execute<ResultSetHeader>(
        //     `INSERT INTO refresh_tokens(user_id, token)
        //     VALUES (?, ?)`,
        //     [user.user_id, refreshToken]
        // )

        return{ user, accessToken, refreshToken}
    
    }







    static async logout(refreshToken: string){
        try{

        const decoded = jwt.verify(refreshToken, refreshSecret) as {userId: string, role: string}
        const pointerKey = `token_to_session:${refreshToken}`
        const sessionId = await client.get(pointerKey)
        if(!sessionId) return false
        await client.multi()
         .hDel(`sessions:${decoded.userId}`, sessionId)
         .del(pointerKey)
         .exec()
        return true;
        // const [result] = await pool.execute<ResultSetHeader>(
        //     `DELETE FROM refresh_tokens WHERE token = ? AND user_id = ?`,
        //     [ refreshToken,decoded.userId]
        // )
        // return result.affectedRows > 0
    }catch(err){
        return false
    }}
    





   static async token({oldToken, deviceName, ip}: {oldToken:string, deviceName: string, ip: string | undefined}): Promise<signupResponse>{
    const connection = await pool.getConnection()

    try{
        await connection.beginTransaction()

        const decoded = jwt.verify(oldToken, refreshSecret) as {userId: string, role: string}
        const [rows] = await connection.execute<UserDTO[] & RowDataPacket[]>(
            `SELECT user_id, role FROM users
            WHERE user_id = ?`,
            [decoded.userId]
        )
        const user = rows[0]
        if(!user){
            const err = new Error('invalid user') as Error & {statusCode: number}
            err.statusCode = 401
            throw err
        }
        const pointerKey = `token_to_session:${oldToken}`
        const oldSessionId = await client.get(pointerKey)
        if(!oldSessionId){
            const err = new Error('invalid session') as Error & {statusCode: number}
            err.statusCode = 401
            throw err
        }
        const sessionExists = await client.hExists(`sessions:${user.user_id}`, oldSessionId)
        if(!sessionExists){
            await client.del(`sessions:${user.user_id}`)
            const err = new Error('Invalid token') as Error & {statusCode: number}
            err.statusCode = 403
            throw err
        }

        const accessToken = jwt.sign({userId: user.user_id, role: user.role}, secret, {expiresIn: process.env.JWT_EXPIRES_IN as any})
        const refreshToken = jwt.sign({userId: user.user_id, role: user.role}, refreshSecret, {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any})

        const sessionData = {
            token: refreshToken,
            deviceName,
            ip,
            createdAt: Date.now()
        }

        const newSessionId = nanoid()
        
        const results = await client.multi()
        .del(pointerKey)// Delete old pointer
        .hDel(`sessions:${user.user_id}`, oldSessionId)// Delete old session field
        .set(`token_to_session:${refreshToken}`, newSessionId, {EX: 7 * 24 * 60 * 60})
        .hSet(`sessions:${user.user_id}`, newSessionId, JSON.stringify(sessionData))
        .expire(`sessions:${user.user_id}`, 7 * 24 * 60 * 60)
        .exec()


         results.forEach((res, i) => {
        if (res instanceof Error) {
            console.error(`Redis command ${i} failed`, res)
            throw res
        }
        })

        // // const [result] = await connection.execute<ResultSetHeader>(
        // //     `DELETE FROM refresh_tokens
        // //     WHERE user_id = ? AND token = ? `,
        // //     [user.user_id, oldToken]
        // // )

        // if (result.affectedRows != 1 ){
        //     await connection.execute(
        //         `DELETE FROM refresh_tokens
        //         WHERE user_id = ?`,
        //         [user.user_id]
        //     )
        //     await connection.commit()
        //     const err = new Error('Invalid refreshToken') as Error & {statusCode: number}
        //     err.statusCode = 403
        //     throw err
        // }


        //add new refreshTpoken to database
        // await connection.execute(
        //     `INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)`,
        //     [user.user_id, refreshToken]
        // );
        

        await connection.commit()
        return {accessToken, refreshToken, user}
    }catch(err){
        await connection.rollback()
        throw err
    }finally{
        connection.release()
    }
   
   }






