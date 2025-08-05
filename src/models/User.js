const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  gymId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Gym', 
    required: true 
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'gym_admin', 'trainer', 'member'],
    default: 'member'
  },
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photoUrl: String,
    dateOfBirth: Date,
    emergencyContact: {
      name: String,
      phone: String
    }
  },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

// Create compound index for gym-specific email uniqueness
userSchema.index({ gymId: 1, email: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);