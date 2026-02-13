import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares';
import { validate } from '../middlewares/validator.middleware';
import { sendInviteHandler, getContributionsInvitesHandler } from '../controllers/contributions.controller';
import { getContributionsInvitesSchema, postContributionInviteSchema } from '../validators/contributions.validators';

export const contributionsRouter = express.Router()


contributionsRouter.use(authenticate)


contributionsRouter.get('/', validate(getContributionsInvitesSchema), getContributionsInvitesHandler)
contributionsRouter.post('/:noteId/invite', validate(postContributionInviteSchema), sendInviteHandler)