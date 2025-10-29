import express from "express";
import { getAllUsers, getLogs, addUser, deleteUser, } from "../controllers/admin.controller.js";
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


/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role_name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role_name:
 *                 type: string
 *                 enum: [admin, teacher, student]
 *                 example: teacher
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing fields or email already exists
 *       401:
 *         description: Unauthorized (no token provided)
 *       403:
 *         description: Access denied (only admin can access)
 *       500:
 *         description: Failed to create user
 */

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete your own account
 *       401:
 *         description: Unauthorized (no token provided)
 *       403:
 *         description: Access denied (only admin can access)
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */



router.get("/users", authenticate, authorizeRoles("admin", "teacher"), getAllUsers);

// ✅ Admin can add new user
router.post("/users", authenticate, authorizeRoles("admin"), addUser);

// ✅ Admin can delete a user
router.delete("/users/:id", authenticate, authorizeRoles("admin"), deleteUser);

router.get("/logs", authenticate, authorizeRoles("admin"), getLogs);

export default router;
