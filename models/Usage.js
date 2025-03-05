// models/Usage.js
const mongoose = require('mongoose');

const UsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Speeds up queries by user
  },
  filesCount: {
    type: Number,
    default: 0,
    min: 0 // Prevents negative values
  },
  storageUsed: {
    type: Number, // Stored in bytes
    default: 0,
    min: 0 // Prevents negative storage usage
  },
  // Optional: Define limits for storage and files
  maxStorageLimit: {
    type: Number, // Stored in bytes
    default: 10 * 1024 * 1024 * 1024, // Example: 10GB default limit
    min: 0
  }
}, { timestamps: true });

// Indexing createdAt for better sorting
UsageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Usage', UsageSchema);

