const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            // Stop retrying after 2 attempts to prevent endless spam when Redis is offline
            if (retries > 2) {
                return false;
            }
            return 500;
        }
    }
});

redisClient.on("error", (err) => {
    // Only log errors that are not standard ECONNREFUSED during offline mode
    if (err.code !== "ECONNREFUSED" && !err.message?.includes("ECONNREFUSED")) {
        console.warn("Redis client warning:", err.message);
    }
});

redisClient.on("connect", () => {
    console.log("Redis connecting...");
});

redisClient.on("ready", () => {
    console.log("Redis connected and ready");
});

module.exports = { redisClient };