import express from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Logging middleware
app.use((req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Health check endpoint
app.get('/', (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response) => {
  res.json({ status: 'ok', message: 'Note-taking API is running.' });
});

// 404 handler
app.use((req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err: Error, req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;
