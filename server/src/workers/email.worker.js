require("dotenv").config();
const { Worker } = require("bullmq");
const bullmqConnection = require("../config/bullmq");
const sendEmail = require("../utils/sendEmail");
const logger = require("../utils/logger");

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        logger.info({ jobId: job.id }, "Processing email job");

        const { to, subject, text, html } = job.data;

        await sendEmail({
            to,
            subject,
            text,
            html
        });

        logger.info({ jobId: job.id, to }, "Email sent successfully");
    },
    {
        connection: bullmqConnection
    }
);

emailWorker.on("completed", (job) => {
    logger.info({ jobId: job.id }, "Email job completed");
});

emailWorker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, error: err.message }, "Email job failed");
});

logger.info("Email worker is running...");

module.exports = emailWorker;