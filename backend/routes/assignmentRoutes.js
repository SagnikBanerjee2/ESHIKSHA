// backend/routes/assignmentRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const User = require('../models/User');

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage Engine for Teacher Assignments (PDFs)
const assignmentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'eshiksha_assignments',
      resource_type: 'auto',  // Auto-detect PDF/Docs
      public_id: `assign-${Date.now()}-${file.originalname.split('.')[0]}`,
      type: 'upload'
    };
  },
});

const assignmentUpload = multer({ storage: assignmentStorage });

// 3. Storage Engine for Student Submissions (PDFs/Images/Docs)
const submissionStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'eshiksha_submissions',
      resource_type: 'auto',
      public_id: `sub-${Date.now()}-${file.originalname.split('.')[0]}`,
      type: 'upload'
    };
  },
});

const submissionUpload = multer({ storage: submissionStorage });


// ---------------- TEACHER: CREATE ASSIGNMENT ----------------
// POST /api/assignments
// 🔥 Uses 'file' to match frontend formData
router.post('/', auth, assignmentUpload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can create assignments.' });
    }

    const { title, description, subject, className, dueDate, totalMarks } = req.body;

    if (!title || !className) {
      return res.status(400).json({ message: 'Title and className are required.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Assignment PDF is required.' });
    }

    // Cloudinary returns the secure URL in req.file.path
    const fileUrl = req.file.path; 

    const assignment = await Assignment.create({
      title,
      description: description || '',
      subject: subject || 'Misc',
      className: String(className),
      dueDate: dueDate ? new Date(dueDate) : null,
      totalMarks: totalMarks || 100,
      filePath: fileUrl, // Storing URL in filePath too for backward compatibility
      fileUrl: fileUrl,
      createdBy: req.user.userId,
    });

    return res.status(201).json(assignment);
  } catch (err) {
    console.error('Error creating assignment:', err);
    return res.status(500).json({ message: 'Failed to create assignment.' });
  }
});

// ---------------- LIST ASSIGNMENTS (student or teacher) ----------------
// GET /api/assignments?className=10&subject=Maths
router.get('/', auth, async (req, res) => {
  try {
    const { className, subject } = req.query;
    const filter = {};

    if (className) filter.className = String(className);
    if (subject) filter.subject = subject;

    const assignments = await Assignment.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // For students, check submission status
    if (req.user.role === 'student') {
      const studentEmail = req.user.email;
      for (let assignment of assignments) {
        const submission = await AssignmentSubmission.findOne({
          assignment: assignment._id,
          email: studentEmail,
        });
        assignment.submitted = !!submission;
        assignment.submissionStatus = submission ? 'submitted' : 'pending';
        if (submission) {
          assignment.submittedAt = submission.createdAt;
        }
      }
    }

    return res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    return res.status(500).json({ message: 'Failed to fetch assignments.' });
  }
});

// ---------------- GET SUBMISSIONS FOR STUDENT ----------------
// GET /api/assignments/my-submissions
router.get('/my-submissions', auth, async (req, res) => {
  try {
    const student =
      req.user.email
        ? await User.findOne({ email: req.user.email })
        : await User.findById(req.user.userId);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const submissions = await AssignmentSubmission.find({
      email: student.email,
    })
      .populate("assignment", "title subject className dueDate totalMarks fileUrl")
      .sort({ createdAt: -1 })
      .lean();

    res.json(submissions);
  } catch (err) {
    console.error("GET /my-submissions error:", err.message);
    res.status(500).json({ message: "Server error fetching submissions" });
  }
});


// ---------------- GET SINGLE ASSIGNMENT ----------------
// GET /api/assignments/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).lean();
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    if (req.user.role === 'student') {
      const submission = await AssignmentSubmission.findOne({
        assignment: assignment._id,
        email: req.user.email,
      });
      assignment.submitted = !!submission;
      if (submission) {
        assignment.submissionDetails = {
          submittedAt: submission.createdAt,
          fileUrl: submission.fileUrl,
          marks: submission.marks,
          remarks: submission.remarks,
          graded: submission.graded,
        };
      }
    }

    return res.json(assignment);
  } catch (err) {
    console.error('Error fetching assignment:', err);
    return res.status(500).json({ message: 'Failed to fetch assignment.' });
  }
});

// ---------------- TEACHER: DELETE ASSIGNMENT ----------------
// DELETE /api/assignments/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can delete assignments.' });
    }

    const id = req.params.id;

    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // delete submissions for this assignment too
    await AssignmentSubmission.deleteMany({ assignment: id });

    return res.json({ message: 'Assignment deleted.' });
  } catch (err) {
    console.error('Error deleting assignment:', err);
    return res.status(500).json({ message: 'Failed to delete assignment.' });
  }
});

// ---------------- STUDENT: SUBMIT ASSIGNMENT ----------------
// POST /api/assignments/:id/submit
// 🔥 Uses 'file' to match frontend formData from student dashboard
router.post('/:id/submit', auth, submissionUpload.single('file'), async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { remarks } = req.body;

    const student =
      req.user.email
        ? await User.findOne({ email: req.user.email })
        : await User.findById(req.user.userId);

    if (!student) {
      return res.status(400).json({ message: "Student not found." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Submission file is required." });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Deadline check
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({
        message: "Assignment submission deadline has passed.",
      });
    }

    // Prevent duplicate submission
    const existing = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      email: student.email,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already submitted this assignment.",
      });
    }

    // Cloudinary URL
    const fileUrl = req.file.path;

    const submission = await AssignmentSubmission.create({
      assignment: assignmentId,
      name: student.name,
      email: student.email,
      className: student.className || assignment.className,
      filePath: fileUrl, // Storing URL
      fileUrl: fileUrl,  // Storing URL
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      remarks: remarks || "",
      graded: false,
    });

    return res.status(201).json({
      message: "Submission uploaded successfully.",
      submissionId: submission._id,
    });
  } catch (err) {
    console.error("Submit assignment error:", err);
    return res.status(500).json({ message: "Failed to submit assignment." });
  }
});


// ---------------- TEACHER: VIEW SUBMISSIONS FOR ONE ASSIGNMENT ----------------
// GET /api/assignments/:id/submissions
router.get('/:id/submissions', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can see submissions.' });
    }

    const assignmentId = req.params.id;
    const { className } = req.query;

    const filter = { assignment: assignmentId };
    if (className) filter.className = String(className);

    const submissions = await AssignmentSubmission.find(filter)
      .populate('assignment', 'title totalMarks dueDate')
      .sort({ createdAt: -1 })
      .lean();

    // Get all students in the class to identify absentees
    const assignment = await Assignment.findById(assignmentId);
    if (assignment) {
      const students = await User.find({ 
        className: assignment.className, 
        role: 'student' 
      }).select('name email');
      
      // Add student info to submissions
      const studentMap = {};
      students.forEach(student => {
        studentMap[student.email] = student.name;
      });

      submissions.forEach(submission => {
        submission.studentName = submission.name || studentMap[submission.email] || 'Unknown';
      });
    }

    return res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return res.status(500).json({ message: 'Failed to fetch submissions.' });
  }
});

// ---------------- TEACHER: GRADE ASSIGNMENT SUBMISSION ----------------
// PUT /api/assignments/submissions/:submissionId/grade
router.put('/submissions/:submissionId/grade', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can grade assignments.' });
    }

    const { marks, remarks } = req.body;
    
    if (!marks && marks !== 0) {
      return res.status(400).json({ message: 'Marks are required.' });
    }

    const submission = await AssignmentSubmission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    submission.marks = marks;
    submission.remarks = remarks || '';
    submission.graded = true;
    submission.gradedAt = new Date();
    submission.gradedBy = req.user.userId;

    await submission.save();

    return res.json({
      message: 'Assignment graded successfully.',
      submission
    });
  } catch (err) {
    console.error('Error grading assignment:', err);
    return res.status(500).json({ message: 'Failed to grade assignment.' });
  }
});

// ---------------- GET ASSIGNMENT STATISTICS ----------------
// GET /api/assignments/:id/stats
router.get('/:id/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can view stats.' });
    }

    const assignmentId = req.params.id;
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // Get all students in the class
    const totalStudents = await User.countDocuments({ 
      className: assignment.className, 
      role: 'student' 
    });

    // Get submissions for this assignment
    const submissions = await AssignmentSubmission.find({ assignment: assignmentId });
    
    const submittedCount = submissions.length;
    const gradedCount = submissions.filter(s => s.graded).length;
    
    // Calculate average marks
    const gradedSubmissions = submissions.filter(s => s.graded && s.marks !== undefined);
    const averageMarks = gradedSubmissions.length > 0 
      ? gradedSubmissions.reduce((sum, s) => sum + s.marks, 0) / gradedSubmissions.length 
      : 0;

    return res.json({
      totalStudents,
      submittedCount,
      pendingCount: submittedCount - gradedCount,
      gradedCount,
      averageMarks: Math.round(averageMarks * 100) / 100,
      submissionRate: totalStudents > 0 ? (submittedCount / totalStudents * 100).toFixed(1) : 0,
      assignment: {
        title: assignment.title,
        dueDate: assignment.dueDate,
        totalMarks: assignment.totalMarks,
      }
    });
  } catch (err) {
    console.error('Error fetching assignment stats:', err);
    return res.status(500).json({ message: 'Failed to fetch assignment statistics.' });
  }
});

module.exports = router;