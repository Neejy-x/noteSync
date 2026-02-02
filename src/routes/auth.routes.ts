import express from 'express';
import type { Router } from 'express';
import { signUpHandler } from '../controllers/auth.controller';
import { validate } from '../middlewares/validator.middleware';
import { signUpSchema } from '../validators/auth.validators';

export const authRouter:Router = express.Router()

authRouter.post('/signup', validate(signUpSchema), signUpHandler)