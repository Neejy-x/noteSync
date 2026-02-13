import { createNoteSchema, searchQuerySchema, getNoteByIdSchema, updateNoteSchema, getAllNotesSchema, deleteNoteSchema } from "../../validators/note.validators";
import { z } from 'zod'

export type NoteInput = z.infer<typeof createNoteSchema.shape.body>

export type getAllNotesInput = z.infer<typeof getAllNotesSchema>

export type getNoteByIdInput = z.infer<typeof getNoteByIdSchema.shape.params>

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>

export type SearchQueryInput = z.infer<typeof searchQuerySchema>

export type DeleteNoteByIdInput = z.infer<typeof deleteNoteSchema>