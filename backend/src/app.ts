import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from "./routes/authRoutes"
import noteRoutes from "./routes/noteRoutes"

dotenv.config();
const app = express();

// Log environment variables for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', (req, res, next) => {
    console.log(`Auth route accessed: ${req.method} ${req.originalUrl}`);
    next();
}, authRoutes);

app.use('/api/notes', (req, res, next) => {
    console.log(`Notes route accessed: ${req.method} ${req.originalUrl}`);
    next();
}, noteRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
    const publicPath = path.resolve(__dirname, '..', 'public');
    console.log('Serving static files from:', publicPath);

    // Serve static files
    app.use(express.static(publicPath));

    // Handle SPA fallback
    app.get('*', (req, res) => {
        console.log('Serving index.html for:', req.originalUrl);
        res.sendFile(path.join(publicPath, 'index.html'), (err) => {
            if (err) {
                console.error('Error sending file:', err);
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Internal Server Error',
                        message: 'Failed to load the application',
                        path: req.originalUrl
                    });
                }
            }
        });
    });
}

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;