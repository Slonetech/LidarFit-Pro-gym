import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Gym from '../models/Gym.js';

// Verify JWT token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.id).populate('gym');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    req.gymId = user.gym?._id || null; // safer access
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.', error: error.message });
  }
};

// Check user role(s)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// Multi-tenant data filtering middleware
export const tenantFilter = (req, res, next) => {
  if (!req.gymId) {
    return res.status(400).json({ message: 'Gym context missing for tenant filtering.' });
  }
  req.filter = { gymId: req.gymId };
  next();
};
