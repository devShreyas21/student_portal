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

// ✅ Submit a task
export const submitTask = async (req, res) => {
  try {
    const { task_id, content } = req.body;
    const student_id = req.user.id;

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const existing = task.submissions.find((s) => s.student_id === student_id);

    if (existing) {
      existing.content = content; // update old submission
    } else {
      task.submissions.push({ student_id, content });
    }

    await task.save();
    await logActivity(req.user.id, `Submitted task ${task_id}`);

    res.json({ message: "Submission successful", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit task" });
  }
};
