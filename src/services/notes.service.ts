import {pool} from  '../db/pool';
import type { ResultSetHeader, RowDataPacket} from 'mysql2/promise'
import { NoteResponse } from '../dto/responses/global.response.js';
import client from '../config/redisClient';
import { CreateNoteInput } from '../dto/input/notes.create';


type NoteRow = NoteResponse & RowDataPacket

export class NotesService {
    static async getAllNotes(
    {user_id, page, limit}: {user_id: string, page: number, limit: number}
): Promise<NoteResponse[]> {

    const offset = (page - 1) * limit

    try{
        const pointerKey = `notes:${user_id}`
        const isCached = await client.Exists(pointerKey)
        if(isCached){
            const cachedNotes = await client.hGetAll(pointerKey)
            if(Object.keys(cachedNotes).length === 0) return [];

            return Object.entries(cachedNotes).map(([noteId, noteData]) => {
                const parsed = JSON.parse(noteData);
                return {
                    noteId,
                    ...parsed
                }
            })
        }
         const [rows] = await pool.query<NoteRow[]>(
            `SELECT DISTINCT n.note_id, n.title, n.content, n.updated_at 
            FROM notes n
            JOIN contributions c USING(note_id)
            WHERE n.owner_id = ?
            OR c.user_id = ?
            ORDER BY n.updated_at DESC
            LIMIT ? OFFSET ?`,
            [user_id, user_id, limit, offset]
        )
        if(rows.length === 0) return []
        const pipeline = client.multi()
        rows.forEach(
            r => {
                pipeline.hSet( pointerKey, r.note_id, JSON.stringify({
                    title: r.title,
                    content: r.content,
                    updated_at: r.updated_at
                }))
            })
        pipeline.expire(pointerKey, 10 * 60)
        await pipeline.exec()
        return rows
    }catch(err){
        throw new Error(`Unable to get notes: ${err}`)
    }
}





    static async getNote({user_id, noteId}: {user_id: string, noteId: string}):Promise<NoteResponse | undefined>{

        const pointerKey = `notes${user_id}`
        const isCached = await client.hExists(pointerKey, noteId)
        if(isCached){
            const note = await client.hGet(pointerKey, noteId)
            if(note) return JSON.parse(note)
        }
        const [rows] = await pool.execute<NoteRow[]>(
            `SELECT DISTINCT n.note_id, n.title, n.content
            FROM notes n
            JOIN contributions c USING(note_id)
            WHERE (n.note_id = ? AND n.owner_id = ?)
             OR (c.note_id = ? AND c.user_id = ?)

            ORDER BY n.updated_at DESC`,
            [noteId, user_id, noteId, user_id]
        )
        const note = rows[0]
        if(!note) return undefined
        await client.hSet(`notes:${user_id}`, noteId, JSON.stringify({
            title: note.title,
             content: note.content,
              updated_at: note.updated_at}
            ))

        return note
    }



    static async createNote({user_id, title, content}: {user_id: string, title: string, content: string}):Promise<{note_id: number} & NoteResponse>{

        const [results] = await pool.execute<ResultSetHeader>(
            `INSERT INTO notes(owner_id, title, content)
            VALUES(?, ?, ?)`,
            [user_id, title, content]
        )

        if(results.affectedRows === 0){
            const err = new Error('Error saving note') as Error & {statusCode: number}
            err.statusCode = 401
            throw err
        }

        const note = {
            note_id: results.insertId,
            title,
            content
        }
        
        return note

    }



    static async updateNote({user_id, title, content, noteId}: {user_id: string, content:string, title: string, noteId: string}):Promise<{noteId: string} & NoteResponse>{

    }


}
       
