const express = require('express');
const router = express.Router();
const Doubt = require('../models/Doubt'); // Ensure path matches your folder structure

// 1. GET all doubts for a specific class
// Route: GET /api/doubts/10
router.get('/:className', async (req, res) => {
  try {
    const { className } = req.params;
    // Get messages sorted by oldest first (like a real chat)
    const doubts = await Doubt.find({ className }).sort({ createdAt: 1 });
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
});

// 2. POST a new doubt message
// Route: POST /api/doubts
router.post('/', async (req, res) => {
  try {
    const { className, text, senderName, role, userId } = req.body;

    if (!className || !text) {
      return res.status(400).json({ message: "Class and text are required" });
    }

    const newDoubt = new Doubt({
      className,
      text,
      senderName: senderName || 'Anonymous',
      role: role || 'student', // default to student if missing
      userId
    });

    const savedDoubt = await newDoubt.save();
    res.status(201).json(savedDoubt);

  } catch (err) {
    console.error("Doubt Error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
});

module.exports = router;

