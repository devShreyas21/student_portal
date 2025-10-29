import express from "express";
import multer from "multer";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.middleware.js";

dotenv.config();

// Keep uploaded file in memory for GridFS
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Connect to MongoDB once
const client = new MongoClient(process.env.MONGO_URI);

// ✅ Upload File to GridFS
router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", () => {
      res.status(200).json({
        message: "File uploaded successfully",
        fileId: uploadStream.id.toString(),
        fileName: req.file.originalname,
      });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload Stream Error:", err);
      res.status(500).json({ message: "File upload failed" });
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get File by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const stream = bucket.openDownloadStream(new ObjectId(id));

    stream.on("error", (err) => {
      console.error("Stream Error:", err);
      res.status(404).json({ message: "File not found" });
    });

    stream.pipe(res);
  } catch (err) {
    console.error("Get File Error:", err);
    res.status(500).json({ message: "Failed to fetch file" });
  }
});

export default router;
