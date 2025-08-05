console.log('Starting server...');

try {
  require('dotenv').config();
  console.log('Dotenv loaded successfully');
} catch (error) {
  console.log('Dotenv not found, using default values');
}

const express = require('express');
const mongoose = require('mongoose');
console.log('Express and Mongoose loaded successfully');

const app = express();

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lidarfit';
    const conn = await mongoose.connect(mongoURI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(' Database connection error:', error.message);
    console.log(' Continuing without database...');
  }
};

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'LidarFit Pro Gym Management System API',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    env: process.env.NODE_ENV || 'development',
    database_status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test database models
app.get('/test-db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    // Test collections
    const Gym = require('./models/Gym');
    const User = require('./models/User');
    const gymCount = await Gym.countDocuments();
    const userCount = await User.countDocuments();
    res.json({
      message: 'Database test successful',
      collections: {
        gyms: gymCount,
        users: userCount
      },
      connection: 'active'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
console.log(' Loading auth routes...');
app.use('/api/auth', require('./routes/auth'));
console.log(' Auth routes mounted');

// ADD THIS LINE - API Routes
console.log('Loading auth routes...');
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running successfully on port ${PORT}`);
  console.log(` Visit: http://localhost:5000`);
});