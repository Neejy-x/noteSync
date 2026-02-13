import { createNoteSchema, searchQuerySchema, getNoteByIdSchema, updateNoteSchema } from "../../validators/note.validators";
import {z} from 'zod'

export type NoteInput = z.infer<typeof createNoteSchema.shape.body>

export type getNoteByIdInput = z.infer<typeof getNoteByIdSchema.shape.params>

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>

export type SearchQueryInput = z.infer<typeof searchQuerySchema>