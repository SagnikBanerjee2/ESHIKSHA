const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    text: { type: String, required: true },
    senderName: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // 🔥 NEW: Store reply details
    replyTo: {
      id: { type: String },       // ID of the message being replied to
      sender: { type: String },   // Name of the person being replied to
      text: { type: String }      // A snippet of the original text
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doubt', doubtSchema);