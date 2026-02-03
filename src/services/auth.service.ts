import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { UserDTO } from '../dto/responses/user.response';
import { loginInput } from '../validators/auth.validators';


interface signupResponse {
    user: UserDTO;
    accessToken: string;
    refreshToken: string;
}

const secret = String(process.env.JWT_SECRET);
const refreshSecret = String(process.env.JW_REFRESH_SECRET);

export class AuthService {

    static async signUp ({username, password, email}: {username: string; password: string; email: string}): Promise<signupResponse>{
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
        await connection.execute<ResultSetHeader>(
            `INSERT INTO refresh_tokens (user_id, token)
            VALUES(?, ?)`,
            [user.user_id, refreshToken]
        )

        await connection.commit()
        return {user, accessToken, refreshToken}
    }catch(err){
        await connection.rollback()
        throw err
    }finally{
        connection.release()
    }
    }

    static async login({username, password}: loginInput):Promise<signupResponse> {
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

        //insert token into db
        await pool.execute<ResultSetHeader>(
            `INSERT INTO refresh_tokens(user_id, token)
            VALUES (?, ?)`,
            [user.user_id, refreshToken]
        )

        return{ user, accessToken, refreshToken}
    
    }

    static async logout(refreshToken: string){
        try{

        const decoded = jwt.verify(refreshToken, refreshSecret) as {userId: string, role: string}
        const [result] = await pool.execute<ResultSetHeader>(
            `DELETE FROM refresh_tokens WHERE token = ? AND user_id = ?`,
            [ refreshToken,decoded.userId]
        )
        return result.affectedRows > 0
    }catch(err){
        return false
    }
    }
    
   
}