const { Worker } = require("bullmq");

const bullmqConnection = require("../config/bullmq");
const sendEmail = require("../utils/sendEmail");

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        console.log("Processing email job:", job.id);

        const { to, subject, text, html } = job.data;

        await sendEmail({
            to,
            subject,
            text,
            html
        });

        console.log("Email sent successfully");
    },
    {
        connection: bullmqConnection
    }
);

emailWorker.on("completed", (job) => {
    console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
    console.error(
        `Email job ${job?.id} failed:`,
        err.message
    );
});

console.log("Email worker is running...");