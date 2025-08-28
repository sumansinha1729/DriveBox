import express from "express";
import Folder from "../models/Folder.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

const normalizeId = (v) =>
  v === undefined || v === null || v === "" || v === "null" ? null : v;

router.post("/", auth, async (req, res) => {
  try {
    let { name, parentId } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const parent = normalizeId(parentId);

    const folder = await Folder.create({
      name: name.trim(),
      parent,
      owner: req.user.id, // store the user's ObjectId
    });

    return res.status(201).json(folder);
  } catch (error) {
    if (error?.code === 11000) {
      // unique index violation (same name under same parent for same user)
      return res
        .status(409)
        .json({ message: "A folder with this name already exists here." });
    }
    if (error?.name === "CastError") {
      return res.status(400).json({ message: "Invalid parent folder id" });
    }
    console.error("[Create folder] error:", error);
    return res.status(500).json({ message: "Create folder failed" });
  }
});

router.get("/", auth, async (req, res) => {
  const parent = normalizeId(req.query.parentId);
  const filter = { owner: req.user.id, parent };
  const folders = await Folder.find(filter).sort({ name: 1 });
  return res.json(folders);
});

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

  return res.json(path);
});

export default router;
