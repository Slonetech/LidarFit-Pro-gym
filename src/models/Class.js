const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  gymId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gym', 
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  classType: {
    type: String,
    enum: ['cardio', 'strength', 'yoga', 'pilates', 'dance', 'martial_arts', 'swimming', 'other'],
    required: true
  },
  durationMinutes: { type: Number, required: true },
  maxCapacity: { type: Number, required: true },
  
  // Requirements
  equipmentNeeded: [String],
  room: String,
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
    default: 'all_levels'
  },
  
  // Pricing (if different from membership)
  dropInPrice: { type: Number, default: 0 },
  creditsRequired: { type: Number, default: 1 },
  
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

classSchema.index({ gymId: 1, status: 1 });

module.exports = mongoose.model('Class', classSchema);