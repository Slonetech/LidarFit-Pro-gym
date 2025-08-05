const express = require('express');
const { registerGym, login, getStats } = require('../controllers/authController');

const router = express.Router();

console.log(' Auth routes module loaded');

// @route   GET /api/auth/stats
router.get('/stats', (req, res) => {
  console.log(' Stats route called');
  getStats(req, res);
});

// @route   POST /api/auth/register-gym
router.post('/register-gym', (req, res) => {
  console.log('🏋️ Register gym route called');
  registerGym(req, res);
});

// @route   POST /api/auth/login
router.post('/login', (req, res) => {
  console.log(' Login route called');
  login(req, res);
});

console.log(' Auth routes configured');

module.exports = router;