const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 1. Define Schema (Keep it here to avoid model errors)
const classUpdateSchema = new mongoose.Schema(
  {
    className: { type: String, required: true }, // e.g. "10"
    text:      { type: String, required: true }, // The message
    postedBy:  { 
        name: { type: String, default: 'Teacher' },
        email: String
    }
  },
  { timestamps: true }
);

const ClassUpdate = mongoose.models.ClassUpdate || mongoose.model('ClassUpdate', classUpdateSchema);

// --- ROUTES ---

// 1. GET: Fetch updates for a specific class
// Matches: GET /api/updates/10
router.get('/:className', async (req, res) => {
  try {
    const { className } = req.params;
   

    const items = await ClassUpdate
      .find({ className })
      .sort({ createdAt: -1 }); // Newest first

    
    res.json(items);
  } catch (err) {
    console.error('❌ Error fetching updates:', err);
    res.status(500).send('Server Error');
  }
});

// 2. POST: Create a new update
// Matches: POST /api/updates
router.post('/', async (req, res) => {
  try {
    const { className, text, authorName } = req.body;
    
    console.log(`📝 Posting update to Class ${className}: ${text}`);

    const newUpdate = await ClassUpdate.create({
      className: className.toString(),
      text,
      postedBy: { name: authorName || 'Teacher' }
    });

    res.json(newUpdate);
  } catch (err) {
    console.error('❌ Error creating update:', err);
    res.status(500).send('Server Error');
  }
});

// 3. DELETE: Remove an update
// Matches: DELETE /api/updates/:id
router.delete('/:id', async (req, res) => {
  try {
    await ClassUpdate.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error('❌ Error deleting:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;