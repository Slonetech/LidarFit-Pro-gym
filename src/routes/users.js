const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorize, tenantFilter } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Apply authentication and tenant filter to all routes
router.use(authenticate);
router.use(tenantFilter);

// @route   GET /api/users
// @desc    Get all users in gym
// @access  Private (Gym Admin+)
router.get('/', 
  authorize('gym_admin', 'trainer', 'super_admin'), 
  getUsers
);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Gym Admin+)
router.get('/:id', 
  authorize('gym_admin', 'trainer', 'super_admin'), 
  getUserById
);

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Gym Admin+)
router.post('/', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('role').isIn(['trainer', 'member']).withMessage('Invalid role')
], handleValidationErrors,
  authorize('gym_admin', 'super_admin'), 
  createUser
);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Gym Admin+)
router.put('/:id', [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('status').optional().isIn(['active', 'suspended', 'inactive']).withMessage('Invalid status'),
  body('role').optional().isIn(['trainer', 'member']).withMessage('Invalid role')
], handleValidationErrors,
  authorize('gym_admin', 'super_admin'), 
  updateUser
);

// @route   DELETE /api/users/:id
// @desc    Deactivate user
// @access  Private (Gym Admin+)
router.delete('/:id', 
  authorize('gym_admin', 'super_admin'), 
  deleteUser
);

module.exports = router;