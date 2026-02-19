const express = require('express');
const router = express.Router();

const User = require('../models/User'); 
const auth = require('../middleware/auth');

// GET /api/users/stats (Global stats)
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const studentCount = await User.countDocuments({ role: 'student' });

    res.json({
      totalUsers,
      studentCount,
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Failed to fetch user stats' });
  }
});

// GET /api/users/stats/by-class?className=7
// Returns detailed stats for teachers or simple counts
router.get('/stats/by-class', auth, async (req, res) => {
  try {
    const { className, detailed } = req.query;
    if (!className) {
      return res.status(400).json({ message: 'className is required' });
    }

    // 1. Simple Count
    const totalStudents = await User.countDocuments({
      role: 'student',
      className: String(className),
    });

    // 2. Detailed List (For Teachers to see progress)
    let students = [];
    if (detailed === 'true') {
        students = await User.find({ role: 'student', className: String(className) })
            .select('name email _id className')
            .lean();
    }

    return res.json({ totalStudents, students });
  } catch (err) {
    console.error('Error in /api/users/stats/by-class:', err);
    return res
      .status(500)
      .json({ message: 'Failed to fetch class stats.' });
  }
});

module.exports = router;