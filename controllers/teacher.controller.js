// controllers/teacher.controller.js
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { logActivity } from "../utils/logger.js";

// ✅ Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, description, students } = req.body;
    const teacher_id = req.user.id;

    const project = new Project({
      title,
      description,
      teacher_id,
      students,
    });

    await project.save();
    await logActivity(req.user.id, `Created project "${title}"`);
    res.json({ message: "Project created successfully", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

// ✅ Get all projects created by the teacher
export const getTeacherProjects = async (req, res) => {
  try {
    const teacher_id = req.user.id;
    const { page = 1, limit = 5, search = "" } = req.query;

    const skip = (page - 1) * limit;

    const query = {
      teacher_id,
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
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// ✅ Add a new task to a project
export const addTask = async (req, res) => {
  try {
    const { project_id, title, description } = req.body;

    const task = new Task({ project_id, title, description });
    await task.save();

    await Project.findByIdAndUpdate(project_id, { $push: { tasks: task._id } });
    await logActivity(req.user.id, `Added task "${title}" to project ${project_id}`);

    res.json({ message: "Task added successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add task" });
  }
};

// ✅ Grade student submission
export const gradeSubmission = async (req, res) => {
  try {
    const { task_id, student_id, grade } = req.body;

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const submission = task.submissions.find((s) => s.student_id === student_id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.grade = grade;
    await task.save();
    await logActivity(req.user.id, `Graded submission for task ${task_id} (student ${student_id})`);

    res.json({ message: "Submission graded successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error grading submission" });
  }
};

// ✅ Edit a project
export const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { title, description, isEdited: true },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// ✅ Soft delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted (soft)", project });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

// ✅ Edit a task
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, isEdited: true },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// ✅ Soft delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted (soft)", task });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
