import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff', 'customer'), listAnnouncements);

router.post(
  '/',
  authorize('admin', 'staff'),
  [body('title').trim().notEmpty(), body('message').trim().notEmpty(), body('audience').isIn(['all', 'staff', 'customers'])],
  handleValidation,
  createAnnouncement
);

router.put('/:id', authorize('admin', 'staff'), [param('id').isMongoId()], handleValidation, updateAnnouncement);

router.delete('/:id', authorize('admin'), deleteAnnouncement);

export default router;


