import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares';
import { validate } from '../middlewares/validator.middleware';
import { sendInviteHandler, getContributionsHandler } from '../controllers/contributions.controller';
import { contributionInviteSchema } from '../validators/contributions.validators';

export const contributionsRouter = express.Router()


contributionsRouter.use(authenticate)


contributionsRouter.get('/', getContributionsHandler)
contributionsRouter.post('/invite/:noteId', validate(contributionInviteSchema), sendInviteHandler)