import {z} from 'zod'

export const createNoteSchema = z.object({
    title: z.string().max(255),
    content: z.string()
})

export const searchQuerySchema = z.object({
    searchQuery: z.string()
})

