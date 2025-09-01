import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from "./routes/authRoutes"
import noteRoutes from "./routes/noteRoutes"

dotenv.config();
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
    const publicPath = path.resolve(__dirname, '..', 'public');

    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, 'index.html'), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error loading the application');
            }
        });
    });
}

export default app;