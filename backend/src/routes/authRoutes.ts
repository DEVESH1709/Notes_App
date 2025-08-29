import express from 'express';
import {requestOTP,verifyOTP,googleLogin} from '../controllers/authController';
const router  =  express.Router();

router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google-login', googleLogin);

export default router;