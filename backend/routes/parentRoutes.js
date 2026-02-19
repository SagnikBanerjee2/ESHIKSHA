// routes/parentRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const ExamSubmission = require('../models/ExamSubmission');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');

const router = express.Router();

// --- Helper: Generate Code (Unchanged) ---
function generateParentCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// --- POST /generate-code (Unchanged) ---
router.post('/generate-code', auth, async (req, res) => {
  try {
    const { role, userId } = req.user;

    if (role === 'teacher') {
      const { studentEmail, studentId } = req.body;
      let student;
      if (studentId) {
        student = await User.findOne({ _id: studentId, role: 'student' });
      } else if (studentEmail) {
        student = await User.findOne({ email: (studentEmail || '').toLowerCase(), role: 'student' });
      } else {
        return res.status(400).json({ message: 'studentEmail or studentId is required.' });
      }

      if (!student) return res.status(404).json({ message: 'Student not found.' });

      if (!student.parentAccessCode) {
        let code, exists = true;
        while (exists) {
          code = generateParentCode();
          exists = await User.findOne({ parentAccessCode: code });
        }
        student.parentAccessCode = code;
        await student.save();
      }
      return res.json({
        studentId: student._id,
        name: student.name,
        className: student.className,
        parentAccessCode: student.parentAccessCode,
        generatedBy: 'teacher',
      });
    }

    if (role === 'student') {
      const student = await User.findById(userId);
      if (!student || student.role !== 'student') return res.status(404).json({ message: 'Student not found.' });

      if (!student.parentAccessCode) {
        let code, exists = true;
        while (exists) {
          code = generateParentCode();
          exists = await User.findOne({ parentAccessCode: code });
        }
        student.parentAccessCode = code;
        await student.save();
      }
      return res.json({
        studentId: student._id,
        name: student.name,
        className: student.className,
        parentAccessCode: student.parentAccessCode,
        generatedBy: 'student',
      });
    }

    return res.status(403).json({ message: 'Unauthorized.' });
  } catch (err) {
    console.error('Generate code error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- GET /overview (UPDATED WITH ASSIGNMENTS) ---
router.get('/overview', auth, async (req, res) => {
  try {
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: 'Only parents can access this.' });
    }

    const parent = await User.findById(req.user.userId).populate('parentOf');

    if (!parent) return res.status(404).json({ message: 'Parent account not found.' });

    if (!parent.parentOf) {
      return res.json({
        student: null,
        attempts: [],
        examSubmissions: [],
        assignmentData: [], // Empty for no student
        message: "No student linked."
      });
    }

    const student = parent.parentOf;

    // 1. Fetch Quiz Attempts
    const attempts = await QuizAttempt.find({
      $or: [{ studentId: student._id }, { email: student.email }]
    })
    .populate('quiz', 'title subject className questions')
    .sort({ createdAt: -1 });

    // 2. Fetch Exam Submissions
    const examSubmissions = await ExamSubmission.find({ 
      studentId: student._id 
    })
    .populate('examId', 'title subject totalQuestions') // Changed totalQuestions to match model usage if needed
    .sort({ submittedAt: -1 });

    // 3. 🔥 FETCH ASSIGNMENT STATUS 🔥
    // A. Get all assignments for this class
    const classAssignments = await Assignment.find({ 
      className: student.className 
    }).sort({ dueDate: 1 }); // Soonest due date first

    // B. Get all submissions by this student
    const mySubmissions = await AssignmentSubmission.find({ 
      email: student.email 
    });

    // C. Map them together
    // Create a lookup map for faster checking: assignmentID -> submissionObj
    const submissionMap = {};
    mySubmissions.forEach(sub => {
      submissionMap[sub.assignment.toString()] = sub;
    });

    const assignmentData = classAssignments.map(assign => {
      const submission = submissionMap[assign._id.toString()];
      return {
        _id: assign._id,
        title: assign.title,
        subject: assign.subject,
        dueDate: assign.dueDate,
        totalMarks: assign.totalMarks,
        status: submission ? 'Submitted' : 'Pending', // The Status Logic
        // If submitted, include details
        submittedAt: submission ? submission.createdAt : null,
        graded: submission ? submission.graded : false,
        marks: submission ? submission.marks : null,
        remarks: submission ? submission.remarks : null
      };
    });

    res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        className: student.className,
      },
      attempts,
      examSubmissions,
      assignmentData, // Send the processed list
    });

  } catch (err) {
    console.error('Parent overview error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;