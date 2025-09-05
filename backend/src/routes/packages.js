import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listPackages, createPackage, updatePackage, deletePackage } from '../controllers/packageController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff', 'customer'), listPackages);

router.post(
  '/',
  authorize('admin'),
  [
    body('name').trim().notEmpty(),
    body('type').isIn(['monthly', 'yearly', 'custom']),
    body('price').isFloat({ gt: 0 })
  ],
  handleValidation,
  createPackage
);

router.put(
  '/:id',
  authorize('admin'),
  [param('id').isMongoId()],
  handleValidation,
  updatePackage
);

router.delete('/:id', authorize('admin'), deletePackage);

export default router;


