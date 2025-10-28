import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { logActivity } from "../utils/logger.js";

/**
 * View projects assigned to the logged-in student
 */
export const getAssignedProjects = async (req, res) => {
  try {
    const student_id = req.user.id;
    const projects = await Project.find({ students: student_id }).populate("tasks");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assigned projects" });
  }
};

/**
 * Submit a task
 */
export const submitTask = async (req, res) => {
  try {
    const { task_id, content } = req.body;
    const student_id = req.user.id;

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const existing = task.submissions.find(s => s.student_id === student_id);
    if (existing) {
      existing.content = content; // update existing submission
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
