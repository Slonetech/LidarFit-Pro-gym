import express from 'express';
import { body } from 'express-validator';
import { register, login, approveUser } from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  handleValidation,
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  handleValidation,
  login
);

router.post(
  '/approve/:id',
  authenticate,
  authorize('admin', 'staff'),
  approveUser
);

export default router;
