// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client' },
  // Store the selected plan: basic, standard, or pro.
  plan: {
    type: String,
    enum: ['basic', 'standard', 'pro'],
    default: 'basic'
  },
  // Date until which the free trial is valid (15 days from registration)
  trialExpiresAt: { type: Date },
  // Optional: Company name for the user's portal
  companyName: { type: String },
  // Unique URL slug for the client portal (if company name is provided)
  clientUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
