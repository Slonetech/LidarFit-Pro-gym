import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  description: { type: String },
  settings: {
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    businessHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '22:00' }
    }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Gym', gymSchema);