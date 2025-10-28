import express from "express";
import { getAllUsers, getLogs } from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/users", authenticate, authorizeRoles("admin"), getAllUsers);

router.get("/logs", authenticate, authorizeRoles("admin"), getLogs);

export default router;
