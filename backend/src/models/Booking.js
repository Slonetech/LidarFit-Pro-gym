const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  classScheduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ClassSchedule', 
    required: true 
  },
  membershipId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Membership', 
    required: true 
  },
  
  bookingStatus: { 
    type: String, 
    enum: ['confirmed', 'waitlisted', 'cancelled', 'no_show', 'attended'],
    default: 'confirmed'
  },
  
  // Payment & Credits
  creditsUsed: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  paymentId: String, // Reference to payment transaction
  
  // Waitlist management
  waitlistPosition: Number,
  
  // Timestamps
  bookedAt: { type: Date, default: Date.now },
  cancelledAt: Date,
  attendedAt: Date,
  
  // Cancellation
  cancellationReason: String,
  refundAmount: { type: Number, default: 0 },
  
  // Notes
  notes: String
}, { timestamps: true });

// Compound indexes
bookingSchema.index({ gymId: 1, userId: 1 });
bookingSchema.index({ gymId: 1, classScheduleId: 1 });
bookingSchema.index({ gymId: 1, bookingStatus: 1 });

// Prevent double booking same class
bookingSchema.index(
  { userId: 1, classScheduleId: 1 }, 
  { unique: true, partialFilterExpression: { bookingStatus: { $in: ['confirmed', 'waitlisted'] } } }
);

module.exports = mongoose.model('Booking', bookingSchema);
