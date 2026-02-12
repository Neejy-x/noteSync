import { createNoteSchema } from "../../validators/note.validators";
import {z} from 'zod'

export type NoteInput = z.infer<typeof createNoteSchema>