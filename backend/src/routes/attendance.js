import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listAttendance, checkIn, checkOut } from '../controllers/attendanceController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff', 'customer'), listAttendance);

router.post(
  '/check-in',
  authorize('admin', 'staff', 'customer'),
  [body('customer').optional().isMongoId()],
  handleValidation,
  checkIn
);

router.post(
  '/:id/check-out',
  authorize('admin', 'staff', 'customer'),
  [param('id').isMongoId()],
  handleValidation,
  checkOut
);

export default router;


