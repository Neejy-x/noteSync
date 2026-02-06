import express from 'express';
import { getAllNotes, getNoteById, createNoteHandler} from '../controllers/notes.controller'
import {authenticate} from '../middlewares/auth.middlewares'

export const noteRouter = express.Router();

noteRouter.use(authenticate)


noteRouter.get('/', getAllNotes)
noteRouter.get('/:noteId', getNoteById)
noteRouter.post('/', createNoteHandler)