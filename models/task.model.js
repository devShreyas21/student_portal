import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student_id: Number,
  content: String,
  file: {
    type: String, // 📎 uploaded file path (if any)
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
});

export const Task = mongoose.model("Task", taskSchema);
