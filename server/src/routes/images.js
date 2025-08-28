import express from "express";
import multer from "multer";
import { auth } from "../middlewares/auth.js";
import Image from "../models/Image.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const normalizeId = (v) =>
  v === undefined || v === null || v === "" || v === "null" ? null : v;

// List images (optionally by folder). When you open a folder, this returns its images by default.
router.get("/", auth, async (req, res) => {
  const folder = normalizeId(req.query.folderId);
  const filter = { owner: req.user.id };
  if (folder === null) filter.folder = null;
  else if (folder) filter.folder = folder;
  const imgs = await Image.find(filter).sort({ createdAt: -1 });
  return res.json(imgs);
});

// Upload an image to Cloudinary and store metadata under current folder (or root if none)
router.post("/upload", auth, upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const folderId = normalizeId(req.body.folderId);
    if (!req.file)
      return res.status(400).json({ message: "Image file is required" });

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
      folder: folderId,
      owner: req.user.id,
      url: result.secure_url,
      publicId: result.public_id,
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error("Upload error:", error.message);
    return res
      .status(500)
      .json({ message: "Upload failed", error: error.message });
  }
});

// Search by name (user-scoped)
router.get("/search", auth, async (req, res) => {
  const { q = "" } = req.query;
  const regex = new RegExp(q, "i");
  const imgs = await Image.find({ owner: req.user.id, name: regex }).sort({
    createdAt: -1,
  });
  return res.json(imgs);
});

export default router;
