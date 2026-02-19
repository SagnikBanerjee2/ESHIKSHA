// backend/models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  // Ensure this structure matches what your frontend sends
  questions: [{
    questionText: { 
      type: String, 
      required: true 
    },
    options: [{ 
      type: String, 
      required: true 
    }],
    correctOptionIndex: { 
      type: Number, 
      required: true 
    }
  }],
  // 🔥 FIX: Make teacherId optional (not required) to prevent validation errors
  teacherId: {
    type: String,
    required: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);