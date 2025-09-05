import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // staff who processed
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'ServicePackage' },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  method: { type: String, enum: ['card', 'cash', 'bank_transfer', 'mpesa'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  transactionRef: { type: String, unique: true },
  receiptUrl: String,
  paidAt: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

paymentSchema.index({ gym: 1, customer: 1, paidAt: -1 });

export default mongoose.model('Payment', paymentSchema);


