// models/File.js
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('File', FileSchema);
