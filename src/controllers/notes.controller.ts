import type { Request, Response } from 'express';
import { NotesService } from '../services/notes.service';
import type { NoteResponse } from '../dto/responses/user.response'
import { catchAsync } from '../utils/catchAsync';
import { Query } from '../dto/input/requests.input';
import { DefaultResponse } from '../dto/responses/user.response';



export const getAllNotes = 
    catchAsync(async (
        req: Request<{}, {}, {}, Query>, 
        res: Response< 
           DefaultResponse
        >) => {
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
})

export const getNoteById = catchAsync(async (req: Request<{noteId: string}>, res: Response<{}>)=>{

        const {noteId} = req.params
        if(!req.user) return res.status(401).json({Success: false, message: 'Unauthorized: user not authenticated'})
        const user_id = req.user.user_id
        
        const note = await NotesService.getNote({user_id, noteId})
        if(!note) return res.status(404).json({Success: false, message: 'Note not found'})
        
        res.status(200).json({Success: true, message: '', data: note})

})