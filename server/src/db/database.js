require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Set IPv4 preference and use public DNS resolvers (Google & Cloudflare)
// to resolve MongoDB Atlas SRV records smoothly on all networks
try {
    dns.setDefaultResultOrder("ipv4first");
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
    // Ignore if not supported in environment
}

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(
            "MONGODB_URI is not defined. Please ensure your .env file contains a valid MONGODB_URI."
        );
    }

    try {
        const connection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("Connected to DB:", connection.connection.host);
        return connection;
    } catch (error) {
        console.error("Failed to connect to DB:", error.message);
        throw error;
    }
};

module.exports = connectDB;
