import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from "./routes/authRoutes"
import noteRoutes from "./routes/noteRoutes"

dotenv.config();
const app = express();


app.use(cors({ 
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-render-app-url.onrender.com' 
        : 'http://localhost:5173', 
    credentials: true 
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

export default app;