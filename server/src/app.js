const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");


const userRoutes = require("./routes/user.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const foodRoutes = require("./routes/food.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const addressRoutes = require("./routes/address.routes");
const checkoutRoutes = require("./routes/checkout.routes");
const ownerRequestRoutes = require("./routes/ownerRequest.routes");
const paymentRoutes = require("./routes/payment.routes");

const { generalLimiter } = require("./middlewares/rateLimiter.middleware");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:3000",
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

app.get("/", (req, res) => {
    res.send("Server is running");
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;