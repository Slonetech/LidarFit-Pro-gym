import express from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validation.js';
import { listPayments, createPayment, getReceipt } from '../controllers/paymentController.js';

const router = express.Router();

/**
 * @openapi
 * /api/payments:
 *   get:
 *     security: [{ bearerAuth: [] }]
 *     summary: List payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payments
 *   post:
 *     security: [{ bearerAuth: [] }]
 *     summary: Create a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created
 * /api/payments/{id}/receipt:
 *   get:
 *     security: [{ bearerAuth: [] }]
 *     summary: Get receipt for a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Receipt JSON
 */

router.use(authenticate);

router.get('/', authorize('admin', 'staff', 'customer'), listPayments);

router.post(
  '/',
  authorize('admin', 'staff'),
  [
    body('customer').isMongoId(),
    body('amount').isFloat({ gt: 0 }),
    body('method').isIn(['card', 'cash', 'bank_transfer', 'mpesa'])
  ],
  handleValidation,
  createPayment
);

router.get('/:id/receipt', authorize('admin', 'staff', 'customer'), [param('id').isMongoId()], handleValidation, getReceipt);

export default router;


