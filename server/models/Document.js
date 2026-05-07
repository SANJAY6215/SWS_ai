const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  path: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'uploading', 'complete', 'failed'], default: 'complete' }
});

module.exports = mongoose.model('Document', documentSchema);
