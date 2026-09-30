const pino = require("pino");

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");

const logger = pino({
    level,
    transport: process.env.NODE_ENV !== "production" ? {
        target: "pino/file",
        options: { destination: 1 } // stdout
    } : undefined,
    base: {
        env: process.env.NODE_ENV || "development"
    },
    timestamp: pino.stdTimeFunctions.isoTime
});

module.exports = logger;
