import express from 'express';
import {createNote, getNotes,deleteNote} from "../controllers/noteController"
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, createNote);
router.get('/', authenticateToken, getNotes);
router.delete('/:id', authenticateToken, deleteNote);

export default router;