const cron = require("node-cron");

cron.schedule("* * * * *", () => {
    console.log("Cron job executed:", new Date());
});

console.log("Cron scheduler started...");