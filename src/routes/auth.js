console.log('Auth routes module loaded');

import express from 'express';
import { registerGym, login, getStats } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
  console.log('Register route hit');
  next();
}, registerGym);

router.post('/login', (req, res, next) => {
  console.log('Login route hit');
  next();
}, login);

router.get('/stats', (req, res, next) => {
  console.log('Stats route hit');
  next();
}, getStats);

// Add this test route
router.get('/hello', (req, res) => {
  console.log('Hello route hit');
  res.json({ message: 'Hello from auth router!' });
});

console.log('Auth routes configured');

export default router;
