import express from "express";
import { getAssignedProjects, submitTask } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Student
 *   description: Student APIs for viewing assigned projects and submitting tasks
 */

/**
 * @swagger
 * /api/student/projects:
 *   get:
 *     summary: Get projects assigned to the logged-in student
 *     description: Fetches all projects that have been assigned to the currently authenticated student, including their related tasks. Supports pagination and optional title-based search.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination (default: 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of projects per page (default: 5)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "AI Project"
 *         description: Optional search keyword to filter projects by title
 *     responses:
 *       200:
 *         description: Successfully fetched assigned projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 projects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "653a1c2e9f8e7a12345abcd6"
 *                       title:
 *                         type: string
 *                         example: "AI Based Sentiment Analysis"
 *                       description:
 *                         type: string
 *                         example: "A project focused on sentiment classification using NLP"
 *                       tasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: "653a1c2e9f8e7a12345abcef"
 *                             title:
 *                               type: string
 *                               example: "Model Training Task"
 *                             description:
 *                               type: string
 *                               example: "Train model using labeled dataset"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Failed to fetch assigned projects
 */
router.get("/projects", authenticate, authorizeRoles("student"), getAssignedProjects);

/**
 * @swagger
 * /api/student/submit:
 *   post:
 *     summary: Submit or update a task submission
 *     description: Allows a student to submit a task with text content and optionally attach a file (uploaded via `/api/upload`). If a submission already exists, it will be updated instead of creating a new one.
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task_id
 *             properties:
 *               task_id:
 *                 type: string
 *                 description: The ID of the task being submitted
 *                 example: "653a1c2e9f8e7a12345abcef"
 *               content:
 *                 type: string
 *                 description: The student's answer or written submission for the task
 *                 example: "Here is my completed assignment content"
 *               fileId:
 *                 type: string
 *                 description: The ID of the uploaded file (from `/api/upload`) — optional
 *                 example: "653a2b4e9f8e7a78901cdef3"
 *     responses:
 *       200:
 *         description: Task submission successful (created or updated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Submission successful
 *                 task:
 *                   type: object
 *                   description: The updated task object containing submissions
 *       400:
 *         description: Missing required task_id field
 *       401:
 *         description: Unauthorized (invalid or missing JWT)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to submit task
 */
router.post("/submit", authenticate, authorizeRoles("student"), submitTask);

export default router;
