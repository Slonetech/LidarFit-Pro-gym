const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getGymDetails, 
  updateGymDetails, 
  getGymStats, 
  getAllGyms 
} = require('../controllers/gymController');
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

// @route   GET /api/gyms/details 
// @desc    Get current gym details 
// @access  Private (Gym Admin+) 
router.get('/details', 
  authenticate, 
  authorize('gym_admin', 'super_admin'), 
  getGymDetails
);

// @route   PUT /api/gyms/details
// @desc    Update gym details 
// @access  Private (Gym Admin only)
router.put('/details', [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Gym name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('address').optional().trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters') 
], handleValidationErrors, 
  authenticate, 
  authorize('gym_admin'),
  updateGymDetails
);

// @route   GET /api/gyms/stats
// @desc    Get gym statistics
// @access  Private (Gym Admin+)
router.get('/stats', 
  authenticate, 
  authorize('gym_admin', 'trainer', 'super_admin'), 
  getGymStats
);

// @route   GET /api/gyms/all
// @desc    Get all gyms (super admin only)
// @access  Private (Super Admin only)
router.get('/all', 
  authenticate, 
  authorize('super_admin'), 
  getAllGyms
);

module.exports = router;