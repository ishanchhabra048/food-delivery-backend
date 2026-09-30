const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { redisClient } = require("../config/redis");

const createStore = (prefix) => {
    if (process.env.NODE_ENV === "test") {
        return undefined; // use in-memory store during tests
    }
    try {
        if (redisClient && redisClient.isReady) {
            return new RedisStore({
                sendCommand: (...args) => redisClient.sendCommand(args),
                prefix: `rl:${prefix}:`
            });
        }
    } catch {
        // Fallback to memory store
    }
    return undefined;
};

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    store: createStore("general"),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    store: createStore("auth"),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later"
    }
});

const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    store: createStore("payment"),
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many payment requests, please try again later"
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    paymentLimiter
};