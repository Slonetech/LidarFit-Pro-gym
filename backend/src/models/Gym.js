import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subscriptionPlan: { 
    type: String, 
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'trial'],
    default: 'trial'
  },
  brandingConfig: {
    primaryColor: { type: String, default: '#3B82F6' },
    logoUrl: String,
    customDomain: String
  }
}, { timestamps: true });

export default mongoose.model('Gym', gymSchema);
