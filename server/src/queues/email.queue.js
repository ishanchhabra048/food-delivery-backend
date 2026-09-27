const { Queue } = require("bullmq");

const bullmqConnection = require("../config/bullmq");

const emailQueue = new Queue("emailQueue", {
    connection: bullmqConnection
});

module.exports = emailQueue;