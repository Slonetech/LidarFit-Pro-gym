import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  name: { type: String, required: true },
  vendor: String,
  purchaseDate: Date,
  cost: Number,
  quantity: { type: Number, default: 1 },
  maintenance: {
    lastServiceDate: Date,
    serviceIntervalDays: { type: Number, default: 180 },
    notes: String
  }
}, { timestamps: true });

equipmentSchema.index({ gym: 1, name: 1 });

export default mongoose.model('Equipment', equipmentSchema);


