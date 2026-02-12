import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares';
import { sendInviteHandler } from '../controllers/contributions.controller';

export const contributionsRouter = express.Router()


contributionsRouter.use(authenticate)


contributionsRouter.get('/', getContribtuonsHandler)
contributionsRouter.post('/invite/:noteId', sendInviteHandler)