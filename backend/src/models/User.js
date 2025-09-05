import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'staff', 'customer'],
    default: 'customer'
  },
  gym: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym' },
  // Optional references for relationships
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who created staff/customer
  managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // staff assigned to a customer
}, { timestamps: true });

export default mongoose.model('User', userSchema);
