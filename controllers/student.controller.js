import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { logActivity } from "../utils/logger.js";

// ✅ View assigned projects (with filtering + pagination)
export const getAssignedProjects = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { page = 1, limit = 5, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      students: student_id,
      title: { $regex: search, $options: "i" },
    };

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate("tasks")
      .skip(skip)
      .limit(Number(limit))
      .sort({ _id: -1 });

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      projects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch assigned projects" });
  }
};

// ✅ Submit a task (with optional file)
export const submitTask = async (req, res) => {
  try {
    const { task_id, content, file } = req.body; // file is optional (path from upload API)
    const student_id = req.user.id;

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // check if student has already submitted
    const existing = task.submissions.find((s) => s.student_id === student_id);

    if (existing) {
      // Update old submission
      existing.content = content || existing.content;
      existing.file = file || existing.file;
    } else {
      // Add new submission
      task.submissions.push({
        student_id,
        content,
        file: file || null,
      });
    }

    await task.save();
    await logActivity(req.user.id, `Submitted task ${task_id}`);

    res.json({ message: "Submission successful", task });
  } catch (err) {
    console.error("Error submitting task:", err);
    res.status(500).json({ message: "Failed to submit task" });
  }
};
