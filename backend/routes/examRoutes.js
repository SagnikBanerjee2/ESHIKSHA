const express = require('express');
const router = express.Router();

// ⚠️ IMPORTS: These must match your actual FILE NAMES in the 'models' folder
const Exam = require('../models/Exam'); 
const ExamSubmission = require('../models/ExamSubmission');

// 🔥 AUTO-FIX: Drop the bad index causing "Duplicate Key" crashes
// This runs once when the server starts to clean up your database logic
ExamSubmission.collection.dropIndex('exam_1_email_1').catch(() => {
    // If the index is already gone, we ignore the error. Safe to keep.
});

// ==========================================
// 1. CREATE EXAM (Teacher Only)
// ==========================================
router.post('/', async (req, res) => {
    try {
        const { title, subject, className, blockId, questions, teacherId } = req.body;

        const BLOCKS = {
            1: { duration: 10, totalQuestions: 7 },
            2: { duration: 20, totalQuestions: 15 },
            3: { duration: 30, totalQuestions: 23 },
            4: { duration: 40, totalQuestions: 38 },
            5: { duration: 70, totalQuestions: 50 },
        };

        const config = BLOCKS[blockId];
        if (!config) return res.status(400).json({ message: "Invalid Block Selection" });

        if (questions.length !== config.totalQuestions) {
            return res.status(400).json({ 
                message: `Block ${blockId} requires exactly ${config.totalQuestions} questions.` 
            });
        }

        const newExam = new Exam({
            title, subject, className, blockId,
            duration: config.duration,
            totalQuestions: config.totalQuestions,
            questions, 
            teacherId
        });

        await newExam.save();
        res.status(201).json(newExam);

    } catch (err) {
        console.error("Create Exam Error:", err);
        res.status(500).json({ message: "Server Error creating exam" });
    }
});

// ==========================================
// 2. GET EXAMS (For Students)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const { className } = req.query;
        if (!className) return res.status(400).json({ message: "Class Name required" });

        // Hide correct answers from students
        const exams = await Exam.find({ className, status: 'Active' })
            .select('-questions.correctOptionIndex') 
            .sort({ createdAt: -1 });

        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: "Server Error fetching exams" });
    }
});

// ==========================================
// 3. LOAD SINGLE EXAM (Start Exam)
// ==========================================
router.get('/:id', async (req, res) => {
    try {
        // Hide correct answers
        const exam = await Exam.findById(req.params.id).select('-questions.correctOptionIndex');
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.json(exam);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ==========================================
// 4. SUBMIT EXAM & CALCULATE SCORE
// ==========================================
router.post('/:id/submit', async (req, res) => {
    try {
        const { 
            studentId, studentName, className, selectedAnswers, resultReleaseTime 
        } = req.body;
        
        const examId = req.params.id;

        // 1. Check for Double Submission
        const existingSubmission = await ExamSubmission.findOne({ examId, studentId });
        if (existingSubmission) {
             return res.status(400).json({ message: "You have already submitted this exam." });
        }

        // 2. Fetch the Exam to check correct answers
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ msg: "Exam not found" });

        // 3. Calculate Score
        let score = 0;
        const totalQuestions = exam.questions.length;
        const safeAnswers = selectedAnswers || [];

        exam.questions.forEach((question, index) => {
            if (safeAnswers[index] === question.correctOptionIndex) {
                score += 1;
            }
        });

        // 4. Save to "ExamSubmission" Collection
        const newSubmission = new ExamSubmission({
            examId: exam._id,
            studentId,
            studentName,
            className,
            selectedAnswers: safeAnswers,
            score,
            totalMarks: totalQuestions,
            submittedAt: new Date(),
            // 🔥 Safety: If frontend didn't send time, set to 30 mins from now
            resultReleaseTime: resultReleaseTime || new Date(Date.now() + 30*60000)
        });

        await newSubmission.save();

        console.log(`✅ Exam Submitted: ${studentName} | Score: ${score}`);
        
        // 5. Return success
        res.json({ 
            msg: "Submission Successful", 
            score, 
            totalMarks: totalQuestions,
            redirect: true 
        });

    } catch (err) {
        console.error("❌ Submission Error:", err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
});

// ==========================================
// 5. TEACHER ROUTES (Details & Submissions)
// ==========================================
router.get('/:id/details', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id); // Includes answers
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.json(exam);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

router.get('/:id/submissions', async (req, res) => {
    try {
        const submissions = await ExamSubmission.find({ examId: req.params.id }).sort({ submittedAt: 1 });
        res.json(submissions);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

// ==========================================
// 6. CHECK RESULT (For Student Dashboard)
// ==========================================
router.get('/:id/result', async (req, res) => {
    try {
        const { studentId } = req.query;
        const submission = await ExamSubmission.findOne({ examId: req.params.id, studentId });

        if (!submission) return res.status(404).json({ message: "Not attempted yet" });

        res.json({ 
            status: "released", 
            score: submission.score, 
            totalMarks: submission.totalMarks 
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ==========================================
// 7. DELETE EXAM
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);
        await ExamSubmission.deleteMany({ examId: req.params.id });
        res.json({ message: "Exam deleted" });
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

module.exports = router;