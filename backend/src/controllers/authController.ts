import { Request, Response } from 'express';
import User from '../models/User';
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { sendOTPEmail } from '../utils/mailer';
import { verifyGoogleToken } from '../utils/googleAuth';
import dotenv from 'dotenv';
dotenv.config();

function generateOTP(): string {
    return Math.floor (100000 + Math.random()*900000).toString();
}
function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  
  try {
    return jwt.sign(
      { userId },
      secret as jwt.Secret,
      { expiresIn } as jwt.SignOptions
    );
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
}


const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const requestOTP = async (req: Request, res: Response) => {
  const { email, name, dob, isSignup } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  let user = await User.findOne({ email });

  if (isSignup && user) {
    return res.status(400).json({ 
      message: 'An account with this email already exists. Please sign in instead.',
      exists: true
    });
  }

  if (isSignup) {
    if (!name || !dob) {
      return res.status(400).json({ 
        message: 'Name and date of birth are required for new users' 
      });
    }
    user = new User({ email, name, dob });
  } else if (!user) {
    return res.status(400).json({
      message: 'No account found with this email. Please sign up first.',
      exists: false
    });
  }
  const otp = generateOTP().trim().toUpperCase();
  const expiry = new Date(Date.now() + 30 * 60 * 1000); 
  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();
  
  console.log(`OTP generated for ${email}:`, { otp, expiry });


  try {
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send OTP email' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    console.log('verifyOTP request body:', req.body);
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      console.error('Missing email or OTP in request');
      return res.status(400).json({ 
        success: false,
        message: "Email and OTP are required" 
      });
    }

    console.log('Looking up user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error('No user found with email:', email);
      return res.status(400).json({ 
        success: false,
        message: "No account found with this email. Please sign up first." 
      });
    }

    console.log('User found. Checking OTP...', { 
      hasOtp: !!user.otp, 
      otpExpiry: user.otpExpiry,
      currentTime: new Date()
    });

    if (!user.otp) {
      console.error('No OTP found for user:', email);
      return res.status(400).json({ 
        success: false,
        message: "No OTP found. Please request a new OTP." 
      });
    }

    const receivedOtp = otp.trim().toUpperCase();
    const storedOtp = user.otp.trim().toUpperCase();
    
    if (storedOtp !== receivedOtp) {
      console.error('OTP mismatch:', { 
        storedOtp: storedOtp, 
        receivedOtp: receivedOtp,
        match: storedOtp === receivedOtp,
        lengths: { stored: storedOtp.length, received: receivedOtp.length }
      });
      return res.status(400).json({ 
        success: false,
        message: "Invalid OTP. Please check and try again." 
      });
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      console.error('OTP expired:', { 
        otpExpiry: user.otpExpiry, 
        now: new Date() 
      });
      return res.status(400).json({ 
        success: false,
        message: "OTP has expired. Please request a new one." 
      });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user._id.toString());
    const response = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob
      }
    };
    
    console.log('Sending successful response');
    res.json(response);
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ message: 'Internal server error during OTP verification' });
  }
};


interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.user.userId).select('-otp -otpExpiry -googleId -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      dob: user.dob
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { tokenId } = req.body;  
  if (!tokenId) {
    return res.status(400).json({ message: 'Google tokenId is required' });
  }
  try {
    const { email, name, googleId } = await verifyGoogleToken(tokenId);

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, googleId });
      await user.save();
    } else if (!user.googleId) {
     
      user.googleId = googleId;
      await user.save();
    }
    const token = generateToken(user._id.toString());
    res.json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Google login failed' });
  }
}