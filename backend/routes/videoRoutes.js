const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage Engine (FINAL FIX)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'eshiksha_notes',
      resource_type: 'auto',        // 🔥 IMPORTANT: Use auto (NOT raw)
      public_id: file.originalname.split('.')[0] + "-" + Date.now(),
      type: 'upload'                // 🔥 IMPORTANT: Force public upload
    };
  },
});

const upload = multer({ storage: storage });

// --- POST: Upload ---
router.post('/', upload.single('notes'), async (req, res) => {
  try {
    console.log("🔹 Upload Request Received");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("✅ Cloudinary Upload Success:", req.file.path);

    const newVideo = new Video({
      title: req.body.title,
      subject: req.body.subject,
      className: req.body.className,
      type: req.body.type || 'notes',
      description: req.body.description,
      notesUrl: req.file.path   // Save Cloudinary secure URL
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);

  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ 
      message: "Upload Failed", 
      error: err.message || "File too large or server error" 
    });
  }
});

// --- GET: Fetch Notes ---
router.get('/', async (req, res) => {
  try {
    const { className } = req.query;
    let query = {};
    if (className) query.className = className;

    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// --- DELETE ---
router.delete('/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

module.exports = router;
