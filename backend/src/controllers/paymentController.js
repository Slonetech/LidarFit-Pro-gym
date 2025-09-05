import Payment from '../models/Payment.js';

export const listPayments = async (req, res) => {
  try {
    const filter = { gym: req.user.gym };
    if (req.user.role === 'customer') filter.customer = req.user._id;
    const items = await Payment.find(filter).sort({ paidAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list payments', error: err.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const data = { ...req.body, gym: req.user.gym, staff: req.user.role !== 'customer' ? req.user._id : undefined };
    const created = await Payment.create(data);
    res.status(201).json({ ...created.toObject(), receiptUrl: created.receiptUrl || `/api/payments/${created._id}/receipt` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment', error: err.message });
  }
};

export const getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, gym: req.user.gym });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json({
      receipt: {
        id: payment._id,
        customer: payment.customer,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        transactionRef: payment.transactionRef
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch receipt', error: err.message });
  }
};


