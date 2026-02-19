// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

// --- 1. IMPORT ROUTES ---
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const videoRoutes = require("./routes/videoRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const parentRoutes = require("./routes/parentRoutes");
const userRoutes = require("./routes/userRoutes");
const classUpdatesRouter = require("./routes/classUpdates");
const examRoutes = require("./routes/examRoutes"); 
const doubtRoutes = require('./routes/doubtRoutes'); // <--- ADD THIS
const app = express();

/* =====================================================
   🔥 CORS — ALLOW LOCALHOST + LIVE FRONTEND
===================================================== */
app.use(cors({
  origin: [
    "https://eshiksha.onrender.com",  // Live Frontend
    "http://localhost:5173",            // Local Frontend (Vite)
    "https://full-sih.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // IMPORTANT: 'Range' and 'Accept-Ranges' are crucial for video streaming
  allowedHeaders: ["Content-Type", "Authorization", "Range"],
  exposedHeaders: ["Content-Range", "Content-Length", "Accept-Ranges"]
}));

/* =====================================================
   MIDDLEWARE
===================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIX: Static files middleware to serve videos from the 'uploads' directory
// This maps the URL path '/uploads' to the physical directory 'backend/uploads'.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================================
   HEALTH CHECK ROUTES
===================================================== */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend Live & Running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API Healthy" });
});

/* =====================================================
   API ROUTES
===================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/updates", classUpdatesRouter);
app.use("/api/exams", examRoutes); 
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/api/doubts', doubtRoutes);
/* =====================================================
   CONNECT DB & START SERVER
===================================================== */
/* 🔍 TEST DATABASE CONNECTION */
app.get("/test-db", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ connected: true, collections });
  } catch (err) {
    res.json({ connected: false, error: err.message });
  }
});

// TEMP: Delete old exams collection if it exists (OPTIONAL - You can remove this block later)
const mongoose = require('mongoose');
mongoose.connection.once('open', async () => {
    try {
        // Only needed if you want to force clear the old 'exams' collection
        // await mongoose.connection.db.dropCollection('exams');
        // console.log('✅ Old Exam Database Cleared!');
    } catch (e) {
        // Ignore error
    }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Running → https://full-sih.onrender.com`);
  });
});
