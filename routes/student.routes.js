import express from "express";
import { getAssignedProjects, submitTask } from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/projects", authenticate, authorizeRoles("student"), getAssignedProjects);
router.post("/submit", authenticate, authorizeRoles("student"), submitTask);

export default router;
