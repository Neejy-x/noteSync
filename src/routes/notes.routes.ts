import express from 'express';
import { 
    getAllNotes,
    getNoteById,
    createNoteHandler,
    updateNoteHandler,
    deleteNoteHandler,
    searchNotesHandler
} from '../controllers/notes.controller'
import {authenticate} from '../middlewares/auth.middlewares'
import { validate } from '../middlewares/validator.middleware';
import { createNoteSchema, deleteNoteSchema, getAllNotesSchema, getNoteByIdSchema, searchQuerySchema, updateNoteSchema } from '../validators/note.validators';

export const noteRouter = express.Router();

noteRouter.use(authenticate)


noteRouter.get('/', validate(getAllNotesSchema),getAllNotes)
noteRouter.get('/search', validate(searchQuerySchema), searchNotesHandler)
noteRouter.get('/:noteId', validate(getNoteByIdSchema), getNoteById)
noteRouter.post('/', validate(createNoteSchema), createNoteHandler)
noteRouter.put('/:noteId', validate(updateNoteSchema), updateNoteHandler)
noteRouter.delete('/:noteId', validate(deleteNoteSchema), deleteNoteHandler)