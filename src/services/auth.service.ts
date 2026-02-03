import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool';
import type { ResultSetHeader } from 'mysql2/promise';
import { UserDTO } from '../dto/responses/user.response';


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

    static async logout(refreshToken: string): Promise<void>{
       const connnection = await pool.getConnection()
    try{
        const decoded = jwt.sign(refreshToken, refreshSecret)
        const [result] = await connnection.execute<ResultSetHeader>(
            `DELETE FROM refresh_tokens WHERE user_id = ?`,
            [decoded.userId]
        )
    }catch(err){

    }

    }
    
   
}