import express from 'express'
import { Router } from 'express'
import { authenticate, isAdmin } from '../middlewares/auth.middlewares'
import { getSessionsHandler } from '../controllers/sessions.controller'

const sessionsRouter: Router = express.Router()

sessionsRouter.get('/', authenticate, getSessionsHandler)
sessionsRouter.post('/end/:sessionId', authenticate, )