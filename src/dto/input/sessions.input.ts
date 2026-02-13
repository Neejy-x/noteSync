import {z} from 'zod'
import { getSessionByIdSchema } from '../../validators/session.validators'

export type getSessionByIdInput = z.infer<typeof getSessionByIdSchema>