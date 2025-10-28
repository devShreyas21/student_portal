import express from "express";
import { getAllUsers, getLogs } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of all users with their roles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied (only admin can access)
 */

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Get all activity logs (paginated)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of logs per page
 *     responses:
 *       200:
 *         description: Returns paginated list of logs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 */


router.get("/users", authenticate, authorizeRoles("admin"), getAllUsers);

router.get("/logs", authenticate, authorizeRoles("admin"), getLogs);

export default router;
