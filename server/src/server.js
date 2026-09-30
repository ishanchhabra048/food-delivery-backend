require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./db/database");
const { redisClient } = require("./config/redis");
const setupSockets = require("./sockets");
const { startCronJobs } = require("./cron");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

const allowedOrigins = process.env.CLIENT_ORIGINS
    ? process.env.CLIENT_ORIGINS.split(",").map((s) => s.trim())
    : ["http://localhost:5173", "http://localhost:3000"];

const startServer = async () => {
    try {
        await connectDB();

        // Connect Redis with graceful fallback if Redis is offline
        try {
            await redisClient.connect();
            logger.info("Redis connected successfully.");
        } catch (redisError) {
            logger.warn({ error: redisError.message }, "Redis connection failed. Starting in fallback mode.");
        }

        const httpServer = http.createServer(app);

        const io = new Server(httpServer, {
            cors: {
                origin: (origin, callback) => {
                    if (!origin) return callback(null, true);
                    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
                        return callback(null, true);
                    }
                    return callback(null, true);
                },
                credentials: true
            }
        });

        setupSockets(io);
        app.set("io", io);

        // Start cron schedules
        startCronJobs();

        const server = httpServer.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });

        server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                logger.error(`Port ${PORT} is already in use by another process.`);
            } else {
                logger.error({ error: err.message }, "Server error");
            }
            process.exit(1);
        });
    } catch (error) {
        logger.error({ error: error.message }, "Server failed to start");
        process.exit(1);
    }
};

startServer();