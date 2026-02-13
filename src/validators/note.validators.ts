import {z} from 'zod'
import { getNoteById } from '../controllers/notes.controller'

export const createNoteSchema = z.object({
    body: z.object({
        title: z.string().max(255),
        content: z.string()})
})

export const getAllNotesSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
        limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional()
    })
})

export const searchQuerySchema = z.object({
    query: z.object({
         page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
        limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional()
    }),
    body: z.object({searchQuery: z.string()})
})

export const getNoteByIdSchema = z.object({
    params: z.object({noteId: z.string()})
})

export const updateNoteSchema = z.object({
    params: z.object({
        noteId: z.string().uuid({message: 'Invalid Note ID format'})
    }),
    body: z.object({
        title: z.string().max(255),
        content: z.string()
    })
})


export const deleteNoteSchema = z.object({
    params: z.object({
        noteId: z.string().uuid({message: 'Note ID must be a valid ID'})
    })
})