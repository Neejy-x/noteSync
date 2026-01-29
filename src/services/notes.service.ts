import {pool} from  '../db/pool';
import type { RowDataPacket} from 'mysql2/promise'
import { NoteResponse } from '../dto/responses/user.response.js';


type NoteRow = NoteResponse & RowDataPacket

export class NotesService {
    static async getAllNotes(
        // userId: number
): Promise<NoteResponse[]> {
    try{
         const [rows] = await pool.query<NoteRow[]>(
            `SELECT title, content FROM notes`
        )
        return rows
    }catch(err){
        throw new Error(`Unable to get notes: ${err}`)
    }
}
    }
       
