import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import folderRoutes from "./routes/folders.js";
import imageRoutes from "./routes/images.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: false }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => res.send("Drivebox API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI).then(() => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET missing (server/.env).");
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`API is running on port: ${PORT}`));
});
