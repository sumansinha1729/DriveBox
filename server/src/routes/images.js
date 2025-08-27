// server/src/routes/images.js
import express from "express";
import multer from "multer";
import { auth } from "../middlewares/auth.js";
import Image from "../models/Image.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload an image to Cloudinary and store metadata
router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, folderId = null } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // FIX: Correct name (streamUpload) and correct req.file
    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "DriveBox" },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        stream.end(buffer);
      });

    const result = await streamUpload(req.file.buffer);

    const doc = await Image.create({
      name,
      folder: folderId || null,
      owner: req.user.id,
      url: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(201).json(doc); // ✅ respond with the created image
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Search by name
router.get("/search", auth, async (req, res) => {
  const { q = "" } = req.query;
  const regex = new RegExp(q, "i");
  const imgs = await Image.find({ owner: req.user.id, name: regex }).sort({
    createdAt: -1,
  });
  res.json(imgs);
});

export default router;
