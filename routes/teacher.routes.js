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

router.post("/project", authenticate, authorizeRoles("teacher"), createProject);
router.get("/projects", authenticate, authorizeRoles("teacher"), getTeacherProjects);
router.post("/task", authenticate, authorizeRoles("teacher"), addTask);
router.put("/grade", authenticate, authorizeRoles("teacher"), gradeSubmission);

export default router;
