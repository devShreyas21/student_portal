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

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload and retrieval APIs using MongoDB GridFS
 */

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file to MongoDB GridFS
 *     description: Allows authenticated users to upload a file which is stored in MongoDB's GridFS bucket.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File uploaded successfully
 *                 fileId:
 *                   type: string
 *                   example: 653a1c2e9f8e7a12345abcd6
 *                 fileName:
 *                   type: string
 *                   example: assignment.pdf
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/upload/{id}:
 *   get:
 *     summary: Fetch a file by its ID
 *     description: Retrieves a file from MongoDB GridFS by its unique file ID.
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 653a1c2e9f8e7a12345abcd6
 *         description: The ID of the file to retrieve
 *     responses:
 *       200:
 *         description: File stream (binary content)
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Failed to fetch file
 */


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
