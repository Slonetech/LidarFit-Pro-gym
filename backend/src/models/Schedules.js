const mongoose = require('mongoose');

const classScheduleSchema = new mongoose.Schema({
  gymId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gym', 
    required: true 
  },
  classId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class', 
    required: true 
  },
  trainerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Schedule details
  scheduledAt: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
  // Capacity management
  maxCapacity: { type: Number, required: true },
  currentBookings: { type: Number, default: 0 },
  waitlistCount: { type: Number, default: 0 },
  
  // Recurring schedule
  isRecurring: { type: Boolean, default: false },
  recurringPattern: {
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'bi_weekly', 'monthly'] 
    },
    daysOfWeek: [Number], // 0=Sunday, 1=Monday, etc.
    endDate: Date
  },
  
  status: { 
    type: String, 
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  
  // Notes
  notes: String,
  cancellationReason: String
}, { timestamps: true });

// Indexes for performance
classScheduleSchema.index({ gymId: 1, scheduledAt: 1 });
classScheduleSchema.index({ gymId: 1, trainerId: 1 });
classScheduleSchema.index({ gymId: 1, status: 1 });

module.exports = mongoose.model('ClassSchedule', classScheduleSchema);