// models/ClientUser.js
const mongoose = require('mongoose');

const ClientUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // The client account is linked to a specific ClientFolder
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientFolder', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ClientUser', ClientUserSchema);
