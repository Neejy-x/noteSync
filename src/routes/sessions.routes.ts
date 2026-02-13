import express from 'express'
import { Router } from 'express'
import { authenticate, isAdmin } from '../middlewares/auth.middlewares'
import { endSessionHandler, getSessionsHandler } from '../controllers/sessions.controller'
import { getSessionByIdSchema } from '../validators/session.validators'
import { validate } from '../middlewares/validator.middleware'

export const sessionsRouter: Router = express.Router()

sessionsRouter.get('/', authenticate, getSessionsHandler)
sessionsRouter.post('/end/:sessionId', validate(getSessionByIdSchema), authenticate, endSessionHandler)