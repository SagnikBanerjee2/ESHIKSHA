const express = require('express');
const router = express.Router();
const ClassUpdate = require('../models/ClassUpdate'); // Make sure path to model is correct

// GET /api/updates/:className
router.get('/:className', async (req, res) => {
  try {
    const { className } = req.params;
    console.log("🔔 Backend received request for class:", className); // DEBUG LOG

    // Find updates where className matches exactly
    const updates = await ClassUpdate.find({ className }).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${updates.length} updates`); // DEBUG LOG
    res.json(updates);
  } catch (err) {
    console.error("❌ Error fetching updates:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;