const mongoose = require('mongoose');

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    // who submitted
    name: { type: String, trim: true },
    email: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },

    // ☁️ CLOUDINARY UPDATE ☁️
    // Made optional because we now use fileUrl for the cloud link
    filePath: { type: String }, 
    
    // This stores the Cloudinary URL (e.g., https://res.cloudinary.com/...)
    fileUrl: { type: String, required: true },
    
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },

    // Grading fields
    marks: { type: Number, min: 0 },
    remarks: { type: String, trim: true },
    graded: { type: Boolean, default: false },
    gradedAt: { type: Date },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Student remarks
    studentRemarks: { type: String, trim: true },
  },
  { timestamps: true }
);

// Index for faster queries
assignmentSubmissionSchema.index({ assignment: 1, email: 1 }, { unique: true });
assignmentSubmissionSchema.index({ email: 1 });
assignmentSubmissionSchema.index({ assignment: 1, graded: 1 });

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);