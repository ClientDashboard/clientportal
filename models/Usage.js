// models/Usage.js
const mongoose = require('mongoose');

const UsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filesCount: {
    type: Number,
    default: 0
  },
  storageUsed: {
    type: Number, // in bytes
    default: 0
  },
  // Add other usage metrics here as needed, for example:
  // tasksCount: { type: Number, default: 0 },
  // formsCreated: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Usage', UsageSchema);
