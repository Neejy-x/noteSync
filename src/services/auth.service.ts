import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool';
import type { ResultSetHeader } from 'mysql2/promise';
import { UserCreateDTO } from '../dto/input/user.create';
import { UserDTO } from '../dto/responses/user.response';


export class authService {
    static async signup(userPayload: UserCreateDTO): Promise<UserDTO> {

        const { username, password, email } = userPayload;
        const hashedPassword = await bcrypt.hash(password, 12)

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)`,
            [username, email, hashedPassword])

        const user: UserDTO = {
            id: result.insertId,
            username,
            email,
            role: 'user'
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES_IN as string }
        )

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_REFRESH_TOKEN as string,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string }
        )

        const [rows] = await pool.query<ResultSetHeader>(
            `INSERT INTO tokens (user_id, token, refresh_token)`
        )

    }
}