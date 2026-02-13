
import { pool } from "../db/pool";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NoteResponse } from "../dto/responses/global.response";
import client from '../config/redisClient'

type NoteRow = RowDataPacket & NoteResponse


export class contributionsService {
    static async sendInvite({user_id, noteId, username, permission} : {user_id: string, noteId: string, permission: string, username: string}):Promise<boolean>{
        try{
       const [rows] =  await pool.execute<NoteRow[]>(
            `SELECT user_id
            FROM users
            WHERE username = ? `,
            [username]
        )

        if(!rows[0]){
            const err = new Error('incorrect username, kindly confirm the username and try again') as Error & {statusCode: number}
            err.statusCode = 404
            throw err
        }
        const inviteeId = rows[0].user_id
        if(inviteeId === user_id){
            const err = new Error('You cannot invite yourself') as Error & {statusCode: number}
            err.statusCode = 400
            throw err
        }
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO contributions(note_id, user_id, permission, status)
            SELECT ?, ?, ?, 'PENDING'
            FROM notes
            WHERE owner_id = ? AND note_id = ?
            ON DUPLICATE KEY UPDATE
                permission = VALUES(permission)
                status = 'PENDING
                `,
            [noteId, inviteeId, permission, user_id, noteId]
        )

        if(result.affectedRows != 1 ){
            const err = new Error('Note not found') as Error & {statusCode: number}
            err.statusCode = 404
            throw err
        }

        return true
    }catch(err: any){
        if (err.code === 'ER_DUP_ENTRY') {
            const err = new Error('User already invited to this note') as Error & { statusCode: number }
            err.statusCode = 409
            throw err
    }
    throw err
    }
}


    static async getAllInvites({user_id, page, limit}: {user_id: string, page: number, limit: number}):Promise<NoteRow[]>{

        const offset = (page - 1) * limit
       
        const [rows] = await pool.execute<NoteRow[]>(
            `SELECT note_id, status, permission
            FROM contributions
            WHERE user_id = ? AND status = 'PENDING'
            LIMIT ?, ?`,
            [user_id, offset, limit]
        )

        return rows
        
}


static async acceptInvite({user_id, noteId}: {user_id: string, noteId: string}):Promise<void>{
    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE contributions
        SET status = 'ACCEPTED
        WHERE note_id = ?
        AND user_id = ?
        AND status = 'PENDING'`,
        [noteId, user_id]
    )

    if(result.affectedRows === 0){
        const err = new Error('Note already handled or not found') as Error & {statusCode: number}
        err.statusCode = 409
        throw err
    }

    return
}

}

