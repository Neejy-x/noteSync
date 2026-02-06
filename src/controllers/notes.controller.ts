import type { Request, Response } from 'express';
import { NotesService } from '../services/notes.service';
import type { NoteResponse } from '../dto/responses/user.response'

export const getAllNotes = async (req: Request, res: Response< {Success: boolean, message: string,data?: NoteResponse[]}>) => {
    const {page} = req.query.page ? {page: Number(req.query.page)}: {page: 1}
    const {limit} = req.query.limit ? {limit: Number(req.query.limit)} : {limit: 10}
    if(!req.user) return res.status(401).json({Success: false, message: 'Unauthroized: user not authenticated'})
    const user_id = req.user?.user_id

    const notes: NoteResponse[] = await NotesService.getAllNotes({user_id, page, limit})
    return res.status(200).json({
        Success: true,
        message: '',
        data: notes
    })

}