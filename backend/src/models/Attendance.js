import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkInAt: { type: Date, required: true, default: Date.now },
  checkOutAt: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // staff/admin handling
  notes: String
}, { timestamps: true });

attendanceSchema.index({ gym: 1, customer: 1, checkInAt: -1 });

export default mongoose.model('Attendance', attendanceSchema);


