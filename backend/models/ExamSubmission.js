const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  examId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exam1', // 👈 IMPORTANT: References your Exam1 model
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  studentName: { 
    type: String, 
    required: true 
  },
  className: { 
    type: String, 
    required: true 
  },

  // Store the index of the selected options
  selectedAnswers: [{ 
    type: Number 
  }], 

  score: { 
    type: Number, 
    default: 0 
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },

  startedAt: { 
    type: Date 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Logic for 30-minute result lock
  resultReleaseTime: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('ExamSubmission', submissionSchema);