import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listProgress, addProgress, updateProgress, deleteProgress } from '../controllers/progressController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff', 'customer'), listProgress);

router.post(
  '/',
  authorize('admin', 'staff', 'customer'),
  [
    body('customer').optional().isMongoId(),
    body('initialWeightKg').isFloat({ gt: 0 }),
    body('currentWeightKg').isFloat({ gt: 0 })
  ],
  handleValidation,
  addProgress
);

router.put(
  '/:id',
  authorize('admin', 'staff', 'customer'),
  [param('id').isMongoId()],
  handleValidation,
  updateProgress
);

router.delete('/:id', authorize('admin', 'staff'), deleteProgress);

export default router;


