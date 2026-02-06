import {pool} from  '../db/pool';
import type { RowDataPacket} from 'mysql2/promise'
import { NoteResponse } from '../dto/responses/user.response.js';


type NoteRow = NoteResponse & RowDataPacket

export class NotesService {
    static async getAllNotes(
    {user_id, page, limit}: {user_id: string, page: number, limit: number}
): Promise<NoteResponse[]> {

    const offset = (page - 1) * limit

    try{
         const [rows] = await pool.query<NoteRow[]>(
            `SELECT DISTINCT n.note_id, n.title, n.content 
            FROM notes n
            JOIN contributions c USING(note_id)
            WHERE n.owner_id = ?
            OR c.user_id = ?
            ORDER BY n.updated_at DESC
            LIMIT ? OFFSET ?`,
            [user_id, user_id, limit, offset]
        )
        if(rows.length === 0) return []

        return rows
    }catch(err){
        throw new Error(`Unable to get notes: ${err}`)
    }
}
    }
       
