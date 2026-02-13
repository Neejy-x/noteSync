import express from 'express';
import { authenticate } from '../middlewares/auth.middlewares';
import { validate } from '../middlewares/validator.middleware';
import { sendInviteHandler, getContributionsInvitesHandler, acceptContributionsHandler} from '../controllers/contributions.controller';
import { acceptContributionSchema, getContributionsInvitesSchema, postContributionInviteSchema, declineContributionsSchema } from '../validators/contributions.validators';

export const contributionsRouter = express.Router()


contributionsRouter.use(authenticate)


contributionsRouter.get('/', validate(getContributionsInvitesSchema), getContributionsInvitesHandler)
contributionsRouter.post('/:noteId/invite', validate(postContributionInviteSchema), sendInviteHandler)
contributionsRouter.patch('/:noteId/accept', validate(acceptContributionSchema), acceptContributionsHandler) 
contributionsRouter.patch('/:noteId/decline', validate(declineContributionsSchema), )