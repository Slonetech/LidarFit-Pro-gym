import mongoose from 'mongoose';

const servicePackageSchema = new mongoose.Schema({
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['monthly', 'yearly', 'custom'], required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  description: String,
  benefits: [String],
  isActive: { type: Boolean, default: true },
  creditsPerPeriod: { type: Number, default: 0 } // 0 for unlimited
}, { timestamps: true });

servicePackageSchema.index({ gym: 1, isActive: 1 });

export default mongoose.model('ServicePackage', servicePackageSchema);


