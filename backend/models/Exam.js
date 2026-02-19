const mongoose = require('mongoose');

// Schema for a single question
const questionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: true 
  },
  options: [{ 
    type: String, 
    required: true 
  }], // Array of 4 strings (Option A, B, C, D)
  correctOptionIndex: { 
    type: Number, 
    required: true 
  } // 0 for A, 1 for B, 2 for C, 3 for D
});

const examSchema = new mongoose.Schema({
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
  examType: { 
    type: String, 
    default: 'MCQ' 
  },
  
  // --- BLOCK CONFIGURATION ---
  // We store the block details here so the frontend knows the rules
  blockId: { 
    type: Number, 
    required: true 
  }, // 1, 2, 3, 4, or 5
  duration: { 
    type: Number, 
    required: true 
  }, // Duration in Minutes (e.g., 10, 20, 30...)
  totalQuestions: { 
    type: Number, 
    required: true 
  }, // e.g., 7, 15, 23...

  // The actual questions added by the teacher
  questions: [questionSchema],

  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // Status to control visibility
  status: { 
    type: String, 
    enum: ['Active', 'Closed'], 
    default: 'Active' 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Exam1', examSchema);