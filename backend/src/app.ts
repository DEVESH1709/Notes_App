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

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use(express.json());

app.use((req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response) => {
  res.json({ status: 'ok', message: 'Note-taking API is running.' });
});

app.use((req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err: Error, req: Request<ParamsDictionary, any, any, ParsedQs>, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;
