const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const pandalRoutes = require('../server/routes/pandalRoutes');
const progressRoutes = require('../server/routes/progressRoutes');

const app = express();

app.use(cors());
app.use(express.json());

let dbConnected = false;

const connectDB = async () => {
  if (dbConnected) return;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Please add it to your environment variables.');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    dbConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

app.get('/api', (req, res) => {
  res.json({ message: 'Pandal Tracker API is running' });
});

app.use('/api/pandals', async (req, res, next) => {
  await connectDB();
  next();
}, pandalRoutes);

app.use('/api/progress', async (req, res, next) => {
  await connectDB();
  next();
}, progressRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: error.message || 'Internal server error' });
});

module.exports = app;
