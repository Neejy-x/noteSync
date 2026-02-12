import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares';
import { sendInviteHandler, getContributionsHandler } from '../controllers/contributions.controller';

export const contributionsRouter = express.Router()


contributionsRouter.use(authenticate)


contributionsRouter.get('/', getContributionsHandler)
contributionsRouter.post('/invite/:noteId', sendInviteHandler)