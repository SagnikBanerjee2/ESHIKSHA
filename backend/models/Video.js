const mongoose = require('mongoose');

// backend/models/Video.js
const videoSchema = new mongoose.Schema({
  title: String,
  subject: String,
  className: String,
  // Ensure 'notes' is in this list:
  type: { 
    type: String, 
    enum: ['long', 'short', 'video', 'notes'], 
    default: 'long' 
  }, 
  description: String,
  notesUrl: String, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);