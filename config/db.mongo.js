// config/db.mongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // <-- Load variables from .env

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1); // Stop the server if missing
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
