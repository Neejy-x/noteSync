import type { Request, Response } from 'express';
import { NotesService } from '../services/notes.service';
import type { NoteResponse } from '../dto/responses/user.response'

export const getAllNotes = async (req: Request, res: Response<NoteResponse[]>) => {

    const notes: NoteResponse[] = await NotesService.getAllNotes();
    return res.status(200).json(notes)

}