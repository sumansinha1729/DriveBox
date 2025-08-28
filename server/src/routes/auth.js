import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

const sign = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });
    if (!process.env.JWT_SECRET) {
      console.error("[/signup] JWT_SECRET missing");
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    const user = await User.create({ name, email, password });
    const token = sign(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    if (error?.code === 11000)
      return res.status(409).json({ message: "Email already registered" });
    console.error("[/signup] error:", error);
    return res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("[/login] body:", req.body);
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    console.log("[/login] user found:", !!user);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    console.log(
      "[/login] user.password:",
      user.password ? user.password.slice(0, 7) + "..." : null
    );
    let ok = false;
    try {
      ok = await bcrypt.compare(password, user.password);
      console.log("[/login] bcrypt ok:", ok);
    } catch (cmpErr) {
      console.error("[/login] bcrypt error:", cmpErr?.message);
      return res.status(500).json({ message: "Password compare failed" });
    }
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      console.error("[/login] JWT_SECRET missing");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = sign(user);
    console.log("[/login] success for:", email);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("[/login] error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
});

export default router;
