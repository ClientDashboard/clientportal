const mongoose = require('mongoose');

const ClientFolderSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  // The unique URL slug that will be shared with clients
  slug: { type: String, required: true, unique: true },
  // The owner of the folder (the user who created it)
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Optional: you can add additional fields like a description here
}, { timestamps: true });

module.exports = mongoose.model('ClientFolder', ClientFolderSchema);
