import { createNoteSchema } from "../../validators/note.validators";
import {z} from 'zod'

export type CreateNoteInput = z.infer<typeof createNoteSchema>