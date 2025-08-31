import mongoose from 'mongoose';
import app from './app';
import path from 'path';
import express from 'express';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });