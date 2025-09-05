import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // staff/admin
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  dueDate: Date,
  completedAt: Date,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
}, { timestamps: true });

todoSchema.index({ gym: 1, customer: 1, status: 1 });

export default mongoose.model('Todo', todoSchema);


