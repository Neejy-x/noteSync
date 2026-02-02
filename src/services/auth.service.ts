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

export class AuthService {

    static async signUp ({username, password, email}: {username: string; password: string; email: string}): Promise<signupResponse>{

        const hashed_password = await bcrypt.hash(password, 12)
        await pool.query<ResultSetHeader>(
            `INSERT INTO users (username, hashed_password, email)
            VALUES(?, ?, ?)`,
            [username, hashed_password,, email]
        )
        const [rows] = await pool.query<any[]>(
            `SELECT id, username, email, role
            FROM users
            WHERE email = ?`, 
            [email])

        const user: UserDTO = rows[0];

        const accessToken = jwt.sign(
            {userId: user.user_id, role: user.role},
            process.env.JWT_ACCESS_SECRET!,
            {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!}
        )
        const refreshToken = jwt.sign(
            {userId: user.user_id, role: user.role},
            process.env.JWT_REFRESH_SECRET as string,
            {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string}
        )
        await pool.query<ResultSetHeader>(
            `INSERT INTO refresh_tokens (user_id, token)
            VALUES(?, ?)`,
            [user.user_id, refreshToken]
        )
        return {user, accessToken, refreshToken}
    }
    
}