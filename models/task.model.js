import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  title: String,
  description: String,
  status: { type: String, default: "pending" },
  submissions: [
    {
      student_id: Number,
      content: String,
      grade: String,
    },
  ],
});

export const Task = mongoose.model("Task", taskSchema);
