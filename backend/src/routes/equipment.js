import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listEquipment, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff', 'customer'), listEquipment);

router.post(
  '/',
  authorize('admin', 'staff'),
  [body('name').trim().notEmpty(), body('quantity').optional().isInt({ min: 1 })],
  handleValidation,
  createEquipment
);

router.put('/:id', authorize('admin', 'staff'), [param('id').isMongoId()], handleValidation, updateEquipment);

router.delete('/:id', authorize('admin'), deleteEquipment);

export default router;


