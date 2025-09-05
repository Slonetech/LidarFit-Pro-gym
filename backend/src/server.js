console.log('Starting server...');

import dotenv from 'dotenv';
dotenv.config();
console.log('Dotenv loaded successfully');

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

console.log('Express and Mongoose loaded successfully');

import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.v2.js';
import progressRoutes from './routes/progress.js';
import packagesRoutes from './routes/packages.js';
import paymentsRoutes from './routes/payments.js';
import equipmentRoutes from './routes/equipment.js';
import attendanceRoutes from './routes/attendance.js';
import announcementsRoutes from './routes/announcements.js';
import todosRoutes from './routes/todos.js';
import { setupSwagger } from './swagger.js';
import Gym from './models/Gym.js';
import User from './models/User.js';

const app = express();

// CORS configuration (must be before any routes)
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.FRONTEND_ORIGIN ? process.env.FRONTEND_ORIGIN.split(',') : ['http://localhost:3000']).map((o) => o.trim());

const corsOptions = isProduction
  ? {
      origin: allowedOrigins,
      credentials: true
    }
  : {
      // In development, reflect the request origin to simplify local testing
      origin: (origin, callback) => callback(null, true),
      credentials: true
    };

app.use(cors(corsOptions));

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lidarfit';
    console.log(`🔌 Attempting MongoDB connection using MONGODB_URI: ${mongoURI}`);
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️ Continuing without database (some features may not work)');
  }
};

await connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'LidarFit Pro Gym Management System API',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    env: process.env.NODE_ENV || 'development',
    database_status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test database collections
app.get('/test-db', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ error: 'Database not connected' });
    }
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

// Create & list dummy users for testing
app.get('/test-users', async (req, res) => {
  try {
    const newUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });
    await newUser.save();

    const users = await User.find();
    res.json({
      message: 'Database test successful',
      users
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database test failed', details: err.message });
  }
});

// API Routes
console.log('Loading auth routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/packages', packagesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/todos', todosRoutes);

// Swagger docs
setupSwagger(app);
console.log('Auth routes mounted');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running successfully on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
