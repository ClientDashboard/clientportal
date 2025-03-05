// models/File.js
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true  // Speeds up queries for user files
  },
  filename: { 
    type: String, 
    required: true, 
    trim: true 
  },
  originalname: { 
    type: String, 
    required: true, 
    trim: true 
  },
  mimetype: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number, 
    required: true, 
    min: 1  // Ensure file size is greater than 0
  },
  path: { 
    type: String, 
    required: true, 
    trim: true,
    select: false  // Prevent returning file paths in queries
  }
}, { timestamps: true });

// Indexing `createdAt` for faster sorting
FileSchema.index({ createdAt: -1 });

module.exports = mongoose.model('File', FileSchema);
