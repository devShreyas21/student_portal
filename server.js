import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/db.mysql.js";
import "./config/db.mongo.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import studentRoutes from "./routes/student.routes.js";

// Swagger
import { swaggerSpec, swaggerUi } from "./swagger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Swagger Docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
