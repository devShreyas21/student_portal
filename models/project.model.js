// models/project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacher_id: Number,
  students: [Number],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

export const Project = mongoose.model("Project", projectSchema);
