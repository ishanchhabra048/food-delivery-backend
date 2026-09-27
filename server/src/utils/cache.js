const { redisClient } = require("../config/redis");

const setCache = async (key, value, expiry = 300) => {
    if (!redisClient.isOpen) return;
    try {
        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX: expiry
            }
        );
    } catch (err) {
        console.warn("Cache set error:", err.message);
    }
};

const getCache = async (key) => {
    if (!redisClient.isOpen) return null;
    try {
        const data = await redisClient.get(key);
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    } catch (err) {
        console.warn("Cache get error:", err.message);
        return null;
    }
};

const delCache = async (key) => {
    if (!redisClient.isOpen) return;
    try {
        await redisClient.del(key);
    } catch (err) {
        console.warn("Cache delete error:", err.message);
    }
};

const clearFoodCache = async () => {
    if (!redisClient.isOpen) return;
    try {
        const keys = [];
        for await (const key of redisClient.scanIterator({
            MATCH: "foods:*",
            COUNT: 100
        })) {
            keys.push(key);
        }

        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.warn("Clear food cache error:", err.message);
    }
};

const clearRestaurantCache = async () => {
    if (!redisClient.isOpen) return;
    try {
        const keys = [];
        for await (const key of redisClient.scanIterator({
            MATCH: "restaurants:*",
            COUNT: 100
        })) {
            keys.push(key);
        }

        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.warn("Clear restaurant cache error:", err.message);
    }
};

module.exports = {
    setCache,
    getCache,
    delCache,
    clearFoodCache,
    clearRestaurantCache
};