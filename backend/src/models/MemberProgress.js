import mongoose from 'mongoose';

const memberProgressSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  initialWeightKg: { type: Number, required: true },
  currentWeightKg: { type: Number, required: true },
  bodyType: { type: String, enum: ['ectomorph', 'mesomorph', 'endomorph', 'unspecified'], default: 'unspecified' },
  bmi: Number,
  bodyFatPercentage: Number,
  notes: String,
  measuredAt: { type: Date, default: Date.now }
}, { timestamps: true });

memberProgressSchema.index({ customer: 1, measuredAt: -1 });

export default mongoose.model('MemberProgress', memberProgressSchema);


