import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, enum: ['all', 'staff', 'customers'], default: 'all' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  publishedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

announcementSchema.index({ gym: 1, isActive: 1, publishedAt: -1 });

export default mongoose.model('Announcement', announcementSchema);


