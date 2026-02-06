import {z} from 'zod'

export const sessionIdValidator = z.object({
    sessionId: z.string().nanoid({message: 'Invalid session ID'})
})