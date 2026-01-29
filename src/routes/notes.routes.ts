import express from 'express';
import { getAllNotes} from '../controllers/notes.controller'
export const noteRouter = express.Router();

noteRouter.get('/', getAllNotes)