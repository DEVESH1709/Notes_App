import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from "./routes/authRoutes"
import noteRoutes from "./routes/noteRoutes"

dotenv.config();
const app = express();

// Basic CORS setup - update with your frontend URL in production
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Serve static files from the public directory
const publicPath = path.resolve(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Serve index.html for all other GET requests
app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath);
});

export default app;