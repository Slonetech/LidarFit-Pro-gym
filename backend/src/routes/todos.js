import express from 'express';
import { body, param, query } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin', 'staff', 'customer'), [query('customer').optional().isMongoId()], handleValidation, listTodos);

router.post(
  '/',
  authorize('admin', 'staff'),
  [body('customer').isMongoId(), body('title').trim().notEmpty()],
  handleValidation,
  createTodo
);

router.put('/:id', authorize('admin', 'staff', 'customer'), [param('id').isMongoId()], handleValidation, updateTodo);

router.delete('/:id', authorize('admin', 'staff'), deleteTodo);

export default router;


