import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { logActivity } from "../utils/logger.js";

// ✅ Get all assigned projects
export const getAssignedProjects = async (req, res) => {
  try {
    const student_id = Number(req.user.id); // ensure number type for Mongo match
    const { page = 1, limit = 5, search = "" } = req.query;
    const skip = (page - 1) * limit;

    // 🔍 Correct query: student_id must match elements inside `students` array
    const query = {
      students: { $in: [student_id] },
      ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    };

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate("tasks") // ensure Project.tasks is ObjectId[] with ref: "Task"
      .skip(skip)
      .limit(Number(limit))
      .sort({ _id: -1 });

    return res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      projects,
    });
  } catch (err) {
    console.error("❌ Error fetching projects:", err.message);
    res.status(500).json({ message: "Failed to fetch assigned projects" });
  }
};

// ✅ Submit a task (with optional fileId from GridFS)
export const submitTask = async (req, res) => {
  try {
    const { task_id, content, fileId } = req.body; // 🆕 fileId replaces file path
    const student_id = Number(req.user.id);

    if (!task_id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // 🔁 Update or add submission
    const existing = task.submissions.find(
      (s) => s.student_id === student_id
    );

    if (existing) {
      existing.content = content || existing.content;
      existing.fileId = fileId || existing.fileId;
    } else {
      task.submissions.push({
        student_id,
        content,
        fileId: fileId || null,
      });
    }

    await task.save();

    await logActivity(
      req.user.id,
      `Submitted task ${task_id}${fileId ? " (with file)" : ""}`
    );

    res.status(200).json({ message: "Submission successful", task });
  } catch (err) {
    console.error("❌ Error submitting task:", err.message);
    res.status(500).json({ message: "Failed to submit task" });
  }
};
