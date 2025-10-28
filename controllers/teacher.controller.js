import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { logActivity } from "../utils/logger.js";

/**
 * Create a new project
 */
export const createProject = async (req, res) => {
  try {
    const { title, description, students } = req.body;
    const teacher_id = req.user.id; // from JWT

    const project = new Project({
      title,
      description,
      teacher_id,
      students, // array of MySQL student IDs
    });

    await project.save();
    await logActivity(req.user.id, `Created project "${title}"`);
    res.json({ message: "Project created", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

/**
 * Get all projects created by this teacher
 */
export const getTeacherProjects = async (req, res) => {
  try {
    const teacher_id = req.user.id;
    const projects = await Project.find({ teacher_id }).populate("tasks");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

/**
 * Add a new task to a project
 */
export const addTask = async (req, res) => {
  try {
    const { project_id, title, description } = req.body;

    const task = new Task({ project_id, title, description });
    await task.save();

    // Link this task in the project document
    await Project.findByIdAndUpdate(project_id, {
      $push: { tasks: task._id },
    });

    await logActivity(req.user.id, `Added task "${title}" to project ${project_id}`);

    res.json({ message: "Task added", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add task" });
  }
};

/**
 * Grade student submission
 */
export const gradeSubmission = async (req, res) => {
  try {
    const { task_id, student_id, grade } = req.body;

    const task = await Task.findById(task_id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const submission = task.submissions.find(s => s.student_id === student_id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.grade = grade;
    await task.save();

    await logActivity(req.user.id, `Graded submission for task ${task_id}, student ${student_id}`);


    res.json({ message: "Submission graded successfully", task });
  } catch (err) {
    res.status(500).json({ message: "Error grading submission" });
  }
};
