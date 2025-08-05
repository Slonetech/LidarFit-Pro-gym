const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  gymId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gym', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  membershipType: {
    type: String,
    enum: ['monthly', 'annual', 'day_pass', 'corporate', 'student'],
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'annually', 'one_time'],
    default: 'monthly'
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  
  // Class access configuration
  classCredits: { type: Number, default: 0 }, // 0 means unlimited
  unlimitedClasses: { type: Boolean, default: false },
  creditsUsed: { type: Number, default: 0 },
  creditsRemaining: { type: Number, default: 0 },
  
  // Dates
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  lastBillingDate: Date,
  nextBillingDate: Date,
  
  autoRenew: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'suspended', 'cancelled'],
    default: 'active'
  },
  
  // Payment tracking
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'cash', 'bank_transfer'],
    default: 'mpesa'
  }
}, { timestamps: true });

// Index for efficient queries
membershipSchema.index({ gymId: 1, userId: 1 });
membershipSchema.index({ gymId: 1, status: 1 });

module.exports = mongoose.model('Membership', membershipSchema);