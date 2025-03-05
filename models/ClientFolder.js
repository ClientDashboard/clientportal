const mongoose = require('mongoose');

const ClientFolderSchema = new mongoose.Schema({
  folderName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true, 
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, // Ensures a clean URL format
    index: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  description: { 
    type: String, 
    trim: true, 
    default: "" 
  }
}, 
{ 
  timestamps: true 
});

// Add an index for efficient sorting by created date
ClientFolderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ClientFolder', ClientFolderSchema);
