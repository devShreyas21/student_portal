// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/db.mysql.js";
import "./config/db.mongo.js";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import studentRoutes from "./routes/student.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

// Swagger
import { swaggerSpec, swaggerUi } from "./swagger.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Main Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ Root Route (for health check)
app.get("/", (req, res) => {
  res.send("🚀 Student Portal API is running!");
});

// ✅ Only listen locally — not on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

// ✅ Export the app for Vercel
export default app;
