// models/ClientUser.js
const mongoose = require('mongoose');

const ClientUserSchema = new mongoose.Schema({
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
    select: false  // Prevent returning password in queries
  },
  folder: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ClientFolder', 
    required: true,
    index: true  // Speeds up queries related to folders
  }
}, { timestamps: true });

// Indexing email for efficient lookups
ClientUserSchema.index({ email: 1 });

module.exports = mongoose.model('ClientUser', ClientUserSchema);
