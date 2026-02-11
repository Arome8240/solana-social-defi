import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { setupSwagger } from "./config/swagger";
import { startCronJobs } from "./services/cronService";

// Routes
import authRoutes from "./routes/authRoutes";
import socialRoutes from "./routes/socialRoutes";
import messageRoutes from "./routes/messageRoutes";
import defiRoutes from "./routes/defiRoutes";
import rewardRoutes from "./routes/rewardRoutes";
import tradeRoutes from "./routes/tradeRoutes";
import nftRoutes from "./routes/nftRoutes";
import miniAppRoutes from "./routes/miniAppRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/defi", defiRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/nfts", nftRoutes);
app.use("/api/mini-apps", miniAppRoutes);

// Swagger Documentation
setupSwagger(app);

// Error Handler (must be last)
app.use(errorHandler);

// Start Server
const startServer = async () => {
  try {
    await connectDatabase();
    logger.info("Database connected successfully");

    startCronJobs();
    logger.info("Cron jobs started");

    app.listen(PORT, () => {
      logger.info(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`,
      );
      logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
