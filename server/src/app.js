const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const pinoHttp = require("pino-http");
const crypto = require("crypto");
const logger = require("./utils/logger");

const userRoutes = require("./routes/user.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const foodRoutes = require("./routes/food.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const addressRoutes = require("./routes/address.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const ownerRequestRoutes = require("./routes/ownerRequest.routes");
const paymentRoutes = require("./routes/payment.routes");
const uploadRoutes = require("./routes/upload.routes");
const adminRoutes = require("./routes/admin.routes");

const { generalLimiter } = require("./middlewares/rateLimiter.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Helmet security headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

// Logging middleware with request ID
app.use(
    pinoHttp({
        logger,
        genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
        customLogLevel: (req, res, err) => {
            if (res.statusCode >= 500 || err) return "error";
            if (res.statusCode >= 400) return "warn";
            return "info";
        }
    })
);

// CORS configuration supporting CLIENT_ORIGINS
const allowedOrigins = process.env.CLIENT_ORIGINS
    ? process.env.CLIENT_ORIGINS.split(",").map((s) => s.trim())
    : ["http://localhost:5173", "http://localhost:3000"];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl/Postman)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
                return callback(null, true);
            }
            return callback(null, true); // Allow local dev easily
        },
        credentials: true
    })
);

app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        }
    })
);

app.use(cookieParser());

// Global API rate limiter
app.use("/api", generalLimiter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Route handlers
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/owner-requests", ownerRequestRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;