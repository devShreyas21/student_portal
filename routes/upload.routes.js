import express from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/upload
router.post("/", authenticate, upload.single("file"), uploadFile);

export default router;
