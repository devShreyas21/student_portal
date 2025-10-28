import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacher_id: Number,
  students: [Number],      // MySQL user IDs
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

export const Project = mongoose.model("Project", projectSchema);
