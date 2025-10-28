import express from "express";
import { getAssignedProjects, submitTask } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student APIs for viewing and submitting tasks
 */

/**
 * @swagger
 * /api/student/projects:
 *   get:
 *     summary: View projects assigned to the logged-in student (with filtering & pagination)
 *     tags: [Student]
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
 *         description: Returns paginated list of assigned projects
 *       401:
 *         description: Unauthorized
 */
router.get("/projects", authenticate, authorizeRoles("student"), getAssignedProjects);

/**
 * @swagger
 * /api/student/submit:
 *   post:
 *     summary: Submit or update a task submission
 *     tags: [Student]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task submission successful
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */
router.post("/submit", authenticate, authorizeRoles("student"), submitTask);

export default router;
