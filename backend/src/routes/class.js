import express from 'express';
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass
} from '../controllers/classController.js';

import { authenticate, authorize, tenantFilter } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(tenantFilter);
router.use(authorize('admin', 'trainer')); // Only admin and trainer can create/update/delete

router.post('/', createClass);
router.get('/', getClasses);
router.get('/:id', getClassById);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

export default router;
