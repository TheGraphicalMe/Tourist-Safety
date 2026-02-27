import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server as IOServer } from "socket.io";

import { logger } from "./utils/logger";
import routes from "./routes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Smart Tourist Safety Backend is running 🚀");
});

app.use("/api", routes);

// --- SOCKET.IO setup ---
const io = new IOServer(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// --- MongoDB connection + server start ---
mongoose
  .connect(MONGO_URI)
  .then(() => {
    logger.info("✅ Connected to MongoDB");

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection error", err);
    process.exit(1);
  });

// Export socket instance
export { io };