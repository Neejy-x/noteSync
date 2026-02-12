
import { pool } from "../db/pool";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NoteResponse } from "../dto/responses/global.response";

type NoteRow = RowDataPacket & NoteResponse


export class contributionsService {
    static async sendInvite({user_id, noteId, username, permission} : {user_id: string, noteId: string, permission: string, username: string}):Promise<boolean>{

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
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO contributions(note_id, user_id, permission)
            SELECT ?, ?, ?
            FROM notes
            WHERE user_id = ? AND note_id = ?`,
            [noteId, inviteeId, permission, noteId, user_id, noteId]
        )

        if(result.affectedRows != 1 ){
            const err = new Error('Note not found') as Error & {statusCode: number}
            err.statusCode = 404
            throw err
        }

        return true
    }
}