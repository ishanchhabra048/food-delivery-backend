const IORedis = require("ioredis");

const bullmqConnection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});

bullmqConnection.on("connect", () => {
    console.log("BullMQ Redis connecting...");
});

bullmqConnection.on("ready", () => {
    console.log("BullMQ Redis ready");
});

bullmqConnection.on("error", (err) => {
    console.error("BullMQ Redis Error:", err);
});

module.exports = bullmqConnection;