import { createNoteSchema, searchQuerySchema } from "../../validators/note.validators";
import {z} from 'zod'

export type NoteInput = z.infer<typeof createNoteSchema>

export type SearchQueryInput = z.infer<typeof searchQuerySchema>