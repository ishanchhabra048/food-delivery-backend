const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Restaurant = require("../models/restaurant.model");
const logger = require("../utils/logger");

const parseCookies = (cookieHeader) => {
    if (!cookieHeader) return {};
    return cookieHeader.split(";").reduce((res, item) => {
        const [k, v] = item.trim().split("=");
        if (k && v) res[k] = decodeURIComponent(v);
        return res;
    }, {});
};

const setupSockets = (io) => {
    // Middleware for Socket.IO authentication
    io.use(async (socket, next) => {
        try {
            const cookies = parseCookies(socket.handshake.headers?.cookie);
            const token =
                socket.handshake.auth?.token ||
                cookies.accessToken ||
                socket.handshake.headers?.authorization?.replace("Bearer ", "");

            if (!token) {
                return next(new Error("Authentication token required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            const user = await User.findById(decoded._id).select("-password -refreshToken");

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = user;
            next();
        } catch (error) {
            logger.warn({ error: error.message }, "Socket auth failed");
            next(new Error("Unauthorized: " + error.message));
        }
    });

    io.on("connection", (socket) => {
        logger.info({ userId: socket.user._id, role: socket.user.role }, "Socket client connected");

        // Join personal user room
        socket.join(`user:${socket.user._id}`);

        // Handle joining order room
        socket.on("join:order", async (data) => {
            try {
                const orderId = typeof data === "string" ? data : data?.orderId;
                if (!orderId) return;

                const order = await Order.findById(orderId);
                if (!order) return;

                // Verify authorization: customer who placed it, owner of restaurant, or admin
                let isAuthorized = socket.user.role === "admin" || order.user.toString() === socket.user._id.toString();
                if (!isAuthorized) {
                    const restaurant = await Restaurant.findById(order.restaurant);
                    if (restaurant && restaurant.owner.toString() === socket.user._id.toString()) {
                        isAuthorized = true;
                    }
                }

                if (isAuthorized) {
                    socket.join(`order:${orderId}`);
                    logger.debug({ orderId, userId: socket.user._id }, "Socket joined order room");
                }
            } catch (err) {
                logger.error(err, "Error in join:order");
            }
        });

        // Handle joining restaurant room (for owners/admin)
        socket.on("join:restaurant", async (data) => {
            try {
                const restaurantId = typeof data === "string" ? data : data?.restaurantId;
                if (!restaurantId) return;

                let isAuthorized = socket.user.role === "admin";
                if (!isAuthorized) {
                    const restaurant = await Restaurant.findById(restaurantId);
                    if (restaurant && restaurant.owner.toString() === socket.user._id.toString()) {
                        isAuthorized = true;
                    }
                }

                if (isAuthorized) {
                    socket.join(`restaurant:${restaurantId}`);
                    logger.debug({ restaurantId, userId: socket.user._id }, "Socket joined restaurant room");
                }
            } catch (err) {
                logger.error(err, "Error in join:restaurant");
            }
        });

        socket.on("disconnect", (reason) => {
            logger.debug({ userId: socket.user?._id, reason }, "Socket client disconnected");
        });
    });

    return io;
};

module.exports = setupSockets;
