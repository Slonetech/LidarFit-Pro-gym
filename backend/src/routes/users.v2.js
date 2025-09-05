import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.v2.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff'), listUsers);

router.get('/:id', authorize('admin', 'staff'), getUser);

router.post(
  '/',
  authorize('admin'),
  [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['staff', 'customer'])
  ],
  handleValidation,
  createUser
);

router.put(
  '/:id',
  authorize('admin', 'staff'),
  [param('id').isMongoId()],
  handleValidation,
  updateUser
);

router.delete('/:id', authorize('admin'), deleteUser);

export default router;


