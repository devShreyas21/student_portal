import express from "express";
import {
  createProject,
  getTeacherProjects,
  addTask,
  gradeSubmission,
} from "../controllers/teacher.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Teacher APIs for managing projects and tasks
 */

/**
 * @swagger
 * /api/teacher/project:
 *   post:
 *     summary: Create a new project
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               students:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Project created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/teacher/projects:
 *   get:
 *     summary: Get all projects created by the teacher (with filtering & pagination)
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default: 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of projects per page (default: 5)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by project title
 *     responses:
 *       200:
 *         description: Returns paginated list of teacher's projects
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/teacher/task:
 *   post:
 *     summary: Add a new task to a project
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/teacher/grade:
 *   put:
 *     summary: Grade a student's submission
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_id:
 *                 type: string
 *               student_id:
 *                 type: integer
 *               grade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission graded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */


router.post("/project", authenticate, authorizeRoles("teacher"), createProject);
router.get("/projects", authenticate, authorizeRoles("teacher"), getTeacherProjects);
router.post("/task", authenticate, authorizeRoles("teacher"), addTask);
router.put("/grade", authenticate, authorizeRoles("teacher"), gradeSubmission);

export default router;
