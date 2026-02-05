import express from 'express';
import type { Router } from 'express';
import { loginHandler, logoutHandler, refreshTokenHandler, signUpHandler } from '../controllers/auth.controller';
import { validate } from '../middlewares/validator.middleware';
import { loginSchema, signUpSchema } from '../validators/auth.validators';

export const authRouter:Router = express.Router()

authRouter.post('/signup', validate(signUpSchema), signUpHandler)
authRouter.post('/login', validate(loginSchema), loginHandler)
authRouter.post('/logout', logoutHandler)
authRouter.post('/token', refreshTokenHandler)