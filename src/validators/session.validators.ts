import {z} from 'zod'

export const getSessionByIdSchema = z.object({
    params: z.object({
        sessionId: z.string().nanoid({message: 'Invalid session ID'})})
})