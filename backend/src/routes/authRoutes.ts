import express from 'express';
import { requestOTP, verifyOTP, googleLogin, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google-login', googleLogin);
router.get('/me', authenticate, getCurrentUser);

export default router;