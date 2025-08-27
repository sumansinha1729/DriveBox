// server/src/routes/folders.js
import express from "express";
import Folder from "../models/Folder.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// Create folder
router.post("/", auth, async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const folder = await Folder.create({
      name,
      parent: parentId || null,
      owner: req.user.id, // FIX
    });
    res.status(201).json(folder);
  } catch (error) {
    const code = error.code === 11000 ? 409 : 500;
    res
      .status(code)
      .json({ message: "Create folder failed", error: error.message });
  }
});

// List folders under a parent (null = root)
router.get("/", auth, async (req, res) => {
  const { parentId = null } = req.query;
  const filter = { owner: req.user.id, parent: parentId };
  const folders = await Folder.find(filter).sort({ name: 1 });
  res.json(folders);
});

// Breadcrumb path root -> target
router.get("/path/:id", auth, async (req, res) => {
  const path = [];
  let curr = await Folder.findOne({ _id: req.params.id, owner: req.user.id });
  if (!curr) return res.status(404).json({ message: "Folder not found" });
  while (curr) {
    path.unshift({ id: curr._id, name: curr.name });
    curr = curr.parent
      ? await Folder.findOne({ _id: curr.parent, owner: req.user.id })
      : null;
  }
  res.json(path);
});

export default router;
