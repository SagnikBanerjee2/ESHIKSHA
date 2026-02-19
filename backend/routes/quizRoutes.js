const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt'); // This is your new Schema

// --- 1. CREATE QUIZ (Teacher) ---
router.post('/', async (req, res) => {
  try {
    const { title, subject, className, questions, teacherId } = req.body;
    
    // Basic validation
    if (!questions || questions.length === 0) {
        return res.status(400).json({ message: "No questions provided" });
    }

    const newQuiz = new Quiz({
      title, 
      subject, 
      className, 
      questions,
      teacherId: teacherId || "Anonymous"
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    console.error("Create Quiz Error:", err);
    res.status(500).json({ message: "Failed to create quiz" });
  }
});

// --- 2. GET QUIZZES (Student/Teacher) ---
router.get('/', async (req, res) => {
  try {
    const { className } = req.query;
    let query = {};
    if (className) query.className = className;
    // Sort by newest first
    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes" });
  }
});

// --- 3. SUBMIT QUIZ (Student) --- 
// 🔥 UPDATED TO MATCH YOUR SCHEMA EXACTLY 🔥
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params; // This is the Quiz ID
    const { answers, name, email, className } = req.body;

    // 1. Get the original quiz to calculate the score
    const quiz = await Quiz.findById(id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // 2. Calculate Score
    let score = 0;
    quiz.questions.forEach((q, index) => {
        // answers[index] is the option index (0, 1, 2, 3) selected by student
        if (answers[index] === q.correctOptionIndex) {
            score++;
        }
    });

    // 3. Create the Attempt Record
    // WE USE THE EXACT FIELD NAMES FROM YOUR SCHEMA HERE:
    const newAttempt = new QuizAttempt({
        quiz: id,           // Schema field: 'quiz'
        name: name,         // Schema field: 'name'
        email: email,       // Schema field: 'email'
        className: className, // Schema field: 'className'
        score: score,       // Schema field: 'score'
        total: quiz.questions.length, // Schema field: 'total'
        answers: answers    // Schema field: 'answers'
    });

    await newAttempt.save();

    res.json({ 
        message: "Quiz Submitted Successfully", 
        score: score, 
        total: quiz.questions.length 
    });

  } catch (err) {
    console.error("Quiz Submit Error:", err);
    
    // Handle "Already Submitted" error (Duplicate Key E11000)
    if (err.code === 11000) {
        return res.status(400).json({ message: "You have already submitted this quiz." });
    }
    
    res.status(500).json({ message: "Failed to submit quiz" });
  }
});

// --- 4. GET CLASS PROGRESS (Teacher Dashboard) ---
// 🔥 UPDATED TO READ FROM QuizAttempt MODEL 🔥
router.get('/class-progress', async (req, res) => {
    try {
        const { className } = req.query;
        if (!className) return res.json([]);

        // Fetch all attempts for this class using the new model
        const attempts = await QuizAttempt.find({ className });

        // Aggregate data per student
        const studentStats = {};

        attempts.forEach(attempt => {
            // Use email as unique identifier
            if (!studentStats[attempt.email]) {
                studentStats[attempt.email] = {
                    studentId: attempt._id, 
                    name: attempt.name,
                    totalScore: 0,
                    totalMaxScore: 0,
                    attemptsCount: 0,
                    totalQuizzes: 0 
                };
            }
            // Add up scores
            studentStats[attempt.email].totalScore += attempt.score;
            studentStats[attempt.email].totalMaxScore += attempt.total;
            studentStats[attempt.email].attemptsCount += 1;
        });

        // Calculate averages and format for frontend
        const responseData = Object.values(studentStats).map(s => ({
            name: s.name,
            avgScore: s.totalMaxScore > 0 ? Math.round((s.totalScore / s.totalMaxScore) * 100) : 0,
            attendancePercent: 90, // Placeholder for attendance if not tracked
            attemptsCount: s.attemptsCount,
            totalQuizzes: 10 // Placeholder or calculate dynamically
        }));

        res.json(responseData);

    } catch (err) {
        console.error("Progress Error:", err);
        res.status(500).json({ message: "Error fetching progress" });
    }
});
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Quiz.findByIdAndDelete(id);
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// backend/routes/quizzes.js

// GET: Fetch all attempts for a specific student
// backend/routes/quizzes.js

// 🔥 FETCH STUDENT'S PERSONAL HISTORY 🔥
router.get('/my-attempts', async (req, res) => {
    try {
        const { studentId } = req.query;
        if (!studentId) return res.status(400).json({ message: "Student ID required" });

        const QuizAttempt = require('../models/QuizAttempt');
        // Find all past attempts for this specific student
        const attempts = await QuizAttempt.find({ 
            $or: [{ quiz: req.query.quizId || { $exists: true } }], // Flexible search
            email: req.query.email || { $exists: true } 
        });

        res.json(attempts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching history" });
    }
});
module.exports = router;