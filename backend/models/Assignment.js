const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Class the assignment belongs to (e.g. "10")
    className: { type: String, required: true, trim: true },

    // Subject like in videos
    subject: {
      type: String,
      enum: ['Science', 'SST', 'Maths', 'English', 'Second Language', 'Misc'],
      default: 'Misc',
    },

    dueDate: { type: Date },

    // 🔥 This is important for your grading logic
    totalMarks: { type: Number, default: 100 }, 

    // ☁️ CLOUDINARY UPDATES ☁️
    // Since we use Cloudinary, 'filePath' is less useful. 
    // I removed 'required: true' so it doesn't crash if you stop saving it.
    filePath: { type: String }, 
    
    // This stores the actual Cloudinary link (e.g. https://res.cloudinary.com/...)
    fileUrl: { type: String, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', assignmentSchema);