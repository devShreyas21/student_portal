// models/task.model.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student_id: Number,
  content: String,
  fileId: {
    type: String, // 🗂️ GridFS file ID
    default: null,
  },
  grade: {
    type: String,
    default: null,
  },
});

const taskSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  status: { type: String, default: "pending" },
  submissions: [submissionSchema],
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

export const Task = mongoose.model("Task", taskSchema);
