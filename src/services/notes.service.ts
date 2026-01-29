import {pool} from  '../db/pool';
import type { RowDataPacket} from 'mysql2/promise'
import { NoteResponse } from '../dto/responses/user.response.js';


type NoteRow = NoteResponse & RowDataPacket

export class NotesService {
    static async getAllNotes(
        // userId: number
): Promise<NoteResponse[]> {
        const [rows] = await pool.execute<NoteRow[]>(
            'SELECT title, content FROM notes'
        )
        return rows
    }
}
