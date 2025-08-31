import express from 'express';
import {createNote, getNotes,deleteNote} from "../controllers/noteController"
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticate, createNote);
router.get('/', authenticate, getNotes);
router.delete('/:id', authenticate, deleteNote);

export default router;