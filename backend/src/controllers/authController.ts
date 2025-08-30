import { Request, Response } from 'express';
import User from '../models/User';
// import jwt, { Secret } from "jsonwebtoken";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { sendOTPEmail } from '../utils/mailer';
import { verifyGoogleToken } from '../utils/googleAuth';
import dotenv from 'dotenv';
dotenv.config();

function generateOTP(): string {
    return Math.floor (100000 + Math.random()*900000).toString();
}


function generateToken(userId: string): string {
  const secret: Secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  // fix typing here
  const expiresIn: SignOptions["expiresIn"] = 
    (process.env.JWT_EXPIRES_IN as any) || "1h";

  const options: SignOptions = { expiresIn };

  return jwt.sign({ userId }, secret, options);
}




export const requestOTP  = async (req: Request,res :Response)=>{
    const {email,name,dob} = req.body;
     if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, name, dob });
  }else {
    user.name = name;
    user.dob = dob; 
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();


  try {
    await sendOTPEmail(email, otp);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send OTP email' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpiry) {
    return res.status(400).json({ message: 'No OTP request found for this email' });
  }
  if (new Date() > user.otpExpiry) {
    return res.status(400).json({ message: 'OTP has expired' });
  }
  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
const token = generateToken(user._id.toString());
// const token = generateToken((user._id as string));
  res.json({ token, user: { email: user.email, name: user.name } });
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