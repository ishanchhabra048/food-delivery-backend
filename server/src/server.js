require("dotenv").config();

const app = require("./app");
const connectDB = require("./db/database");
const { redisClient } = require("./config/redis");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        // Connect Redis with graceful fallback if Redis is offline
        try {
            await redisClient.connect();
            console.log("Redis connected successfully.");
        } catch (redisError) {
            console.warn("⚠️ Redis connection failed:", redisError.message);
            console.warn("Server starting in fallback mode (Redis cache disabled).");
        }

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        server.on("error", (err) => {
            if (err.code === "EADDRINUSE") {
                console.error(`❌ Port ${PORT} is already in use by another process.`);
                console.error(`Please kill the process using port ${PORT} or change PORT in .env.`);
            } else {
                console.error("Server error:", err.message);
            }
            process.exit(1);
        });
    }
    catch (error) {
        console.error("Server failed to start:", error.message);
        process.exit(1);
    }
};

startServer();