// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    select: false  // Prevent password from being returned in queries
  },
  role: { 
    type: String, 
    enum: ['client', 'admin'], // Ensure only valid roles are assigned
    default: 'client' 
  },
  plan: { 
    type: String, 
    enum: ['basic', 'standard', 'pro'], 
    default: 'basic' 
  },
  trialExpiresAt: { 
    type: Date 
  },
  companyName: { 
    type: String, 
    trim: true 
  },
  clientUrl: { 
    type: String, 
    unique: true,  // Ensures no duplicate URLs
    trim: true,
    lowercase: true 
  }
}, { timestamps: true });

// Indexing for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ clientUrl: 1 });

module.exports = mongoose.model('User', UserSchema);

