const cron = require("node-cron");
const logger = require("../utils/logger");

const startCronJobs = () => {
    cron.schedule("*/15 * * * *", () => {
        logger.info({ timestamp: new Date().toISOString() }, "Cron heartbeat executed");
    });

    logger.info("Cron scheduler started...");
};

module.exports = { startCronJobs };