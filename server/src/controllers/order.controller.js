const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Restaurant = require("../models/restaurant.model");
const Address = require("../models/address.model");
const { getPagination, getSort } = require("../utils/paginate");

const formatAddress = (address) => [
    address.fullName,
    address.phoneNumber,
    address.addressLine,
    address.city,
    address.state,
    address.pincode
].filter(Boolean).join(", ");


// ==================== CREATE ORDER ====================

const createOrder = asyncHandler(async (req, res) => {
    const { addressId } = req.body;

    // 1. Check address
    if (!addressId) {
        throw new ApiError(400, "Address is required");
    }

    // 2. Find user's address
    const address = await Address.findOne({
        _id: addressId,
        user: req.user._id
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    // 3. Find user's cart
    const cart = await Cart.findOne({
        user: req.user._id
    }).populate("items.food");

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // 4. Check cart is not empty
    if (cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }

    // Check food existence and availability
    const missingItems = cart.items.filter((item) => !item.food);
    if (missingItems.length > 0) {
        throw new ApiError(
            400,
            "Some items in your cart are no longer available. Please update your cart."
        );
    }

    const unavailableItems = cart.items.filter(
        (item) => !item.food.isAvailable
    );
    if (unavailableItems.length > 0) {
        throw new ApiError(
            400,
            "Some items in your cart are currently unavailable"
        );
    }

    // 5. Get restaurant from first food item
    const restaurantId = cart.items[0].food.restaurant;

    // 6. Make sure all food belongs to same restaurant
    const isSameRestaurant = cart.items.every(
        (item) =>
            item.food.restaurant.toString() === restaurantId.toString()
    );

    if (!isSameRestaurant) {
        throw new ApiError(
            400,
            "All items in the cart must belong to the same restaurant"
        );
    }

    // 7. Create order items
    const orderItems = cart.items.map((item) => ({
        food: item.food._id,
        quantity: item.quantity,

        // Save current price as snapshot
        price: item.food.price
    }));

    // 8. Calculate food items total
    const itemTotal = cart.items.reduce(
        (total, item) =>
            total + item.food.price * item.quantity,
        0
    );

    // 9. Delivery fee
    const deliveryFee = 40;

    // 10. Calculate tax (5%)
    const tax = Math.round(itemTotal * 0.05);

    // 11. Final amount
    const totalAmount =
        itemTotal + deliveryFee + tax;

    // 12. Transactional Order Creation & Cart Clearing
    let session = null;
    let order;

    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const createdOrders = await Order.create([
            {
                user: req.user._id,
                restaurant: restaurantId,
                items: orderItems,
                itemTotal,
                deliveryFee,
                tax,
                totalAmount,
                address: address._id,
                deliveryAddress: formatAddress(address)
            }
        ], { session });

        order = createdOrders[0];

        // Clear cart after order creation
        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();
    } catch (error) {
        if (session) {
            try {
                await session.abortTransaction();
            } catch (_) {}
        }

        // Fallback for standalone/in-memory Mongo instances without replica set
        try {
            order = await Order.create({
                user: req.user._id,
                restaurant: restaurantId,
                items: orderItems,
                itemTotal,
                deliveryFee,
                tax,
                totalAmount,
                address: address._id,
                deliveryAddress: formatAddress(address)
            });

            cart.items = [];
            await cart.save();
        } catch (fallbackError) {
            throw error;
        }
    } finally {
        if (session) {
            try {
                await session.endSession();
            } catch (_) {}
        }
    }

    // Emit Socket.IO event to restaurant owner room
    const io = req.app.get("io");
    if (io) {
        try {
            const populatedOrder = await Order.findById(order._id)
                .populate("user", "fullName email phoneNumber")
                .populate("restaurant", "name")
                .populate("items.food", "name price image");
            io.to(`restaurant:${restaurantId}`).emit("order:new", populatedOrder || order);
        } catch (socketErr) {
            console.error("Socket emit error on createOrder:", socketErr.message);
        }
    }

    // 14. Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            "Order created successfully",
            order
        )
    );
});


// ==================== GET MY ORDERS ====================

const getMyOrders = asyncHandler(async (req, res) => {
    const { page, limit, status, paymentStatus, sortBy, sortOrder } = req.query;

    // 1. Pagination & Sorting setup
    const { skip, buildPaginationResponse } = getPagination({ page, limit });
    const sort = getSort(
        { sortBy, sortOrder },
        ["totalAmount", "createdAt"],
        { createdAt: -1 }
    );

    // 2. Build Filter object
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // 3. Query Database
    const [totalDocs, orders] = await Promise.all([
        Order.countDocuments(filter),
        Order.find(filter)
            .populate("items.food", "name price image")
            .populate("restaurant", "name image")
            .populate("address")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit) || 10)
    ]);

    // 4. Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Orders fetched successfully",
            {
                orders,
                pagination: buildPaginationResponse(totalDocs)
            }
        )
    );
});


// ==================== GET ORDER BY ID ====================

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if requester is customer, restaurant owner, or admin
    let order;
    if (req.user.role === "admin") {
        order = await Order.findById(id)
            .populate("restaurant", "name address image")
            .populate("items.food", "name price image")
            .populate("address")
            .populate("user", "fullName email phoneNumber");
    } else if (req.user.role === "restaurantOwner") {
        order = await Order.findById(id)
            .populate("restaurant", "name address image")
            .populate("items.food", "name price image")
            .populate("address")
            .populate("user", "fullName email phoneNumber");
        
        if (order) {
            const restaurant = await Restaurant.findById(order.restaurant?._id || order.restaurant);
            if (!restaurant || restaurant.owner.toString() !== req.user._id.toString()) {
                if (order.user?._id?.toString() !== req.user._id.toString()) {
                    throw new ApiError(403, "You are not authorized to view this order");
                }
            }
        }
    } else {
        order = await Order.findOne({
            _id: id,
            user: req.user._id
        })
            .populate("restaurant", "name address image")
            .populate("items.food", "name price image")
            .populate("address");
    }

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Order fetched successfully",
            order
        )
    );
});


// ==================== CANCEL ORDER ====================

const cancelOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({
        _id: id,
        user: req.user._id
    });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Customer can cancel only before preparation starts
    if (
        order.status !== "PLACED" &&
        order.status !== "CONFIRMED"
    ) {
        throw new ApiError(
            400,
            "Order cannot be cancelled at this stage"
        );
    }

    order.status = "CANCELLED";
    await order.save();

    // Emit Socket.IO event
    const io = req.app.get("io");
    if (io) {
        io.to(`order:${order._id}`).emit("order:status", {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt
        });
        io.to(`restaurant:${order.restaurant}`).emit("order:status", {
            orderId: order._id,
            status: order.status
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Order cancelled successfully",
            order
        )
    );
});


// ==================== GET RESTAURANT ORDERS ====================

const getRestaurantOrders = asyncHandler(async (req, res) => {
    const { page, limit, status, paymentStatus, sortBy, sortOrder } = req.query;

    // 1. Pagination & Sorting setup
    const { skip, buildPaginationResponse } = getPagination({ page, limit });
    const sort = getSort(
        { sortBy, sortOrder },
        ["totalAmount", "createdAt"],
        { createdAt: -1 }
    );

    // Find restaurants owned by logged-in owner
    const restaurants = await Restaurant.find({
        owner: req.user._id
    });

    if (restaurants.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                "Restaurant orders fetched successfully",
                {
                    orders: [],
                    pagination: buildPaginationResponse(0)
                }
            )
        );
    }

    const restaurantIds = restaurants.map(
        (restaurant) => restaurant._id
    );

    // 2. Build Filter object
    const filter = {
        restaurant: {
            $in: restaurantIds
        }
    };
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // 3. Query Database
    const [totalDocs, orders] = await Promise.all([
        Order.countDocuments(filter),
        Order.find(filter)
            .populate(
                "user",
                "fullName email phoneNumber"
            )
            .populate(
                "restaurant",
                "name"
            )
            .populate(
                "items.food",
                "name price image"
            )
            .sort(sort)
            .skip(skip)
            .limit(Number(limit) || 10)
    ]);

    // 4. Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Restaurant orders fetched successfully",
            {
                orders,
                pagination: buildPaginationResponse(totalDocs)
            }
        )
    );
});


// ==================== UPDATE ORDER STATUS ====================

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(
            400,
            "Status is required"
        );
    }

    const allowedStatuses = [
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new ApiError(
            400,
            "Invalid status"
        );
    }

    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    // Check restaurant ownership
    const restaurant = await Restaurant.findOne({
        _id: order.restaurant,
        owner: req.user._id
    });

    if (!restaurant) {
        throw new ApiError(
            403,
            "You are not authorized to update this order"
        );
    }

    // Cannot update cancelled or delivered orders
    if (
        order.status === "CANCELLED" ||
        order.status === "DELIVERED"
    ) {
        throw new ApiError(
            400,
            "Order cannot be updated at this stage"
        );
    }

    order.status = status;
    await order.save();

    // Emit Socket.IO event to order room, restaurant room, and customer user room
    const io = req.app.get("io");
    if (io) {
        io.to(`order:${order._id}`).emit("order:status", {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt
        });
        io.to(`restaurant:${order.restaurant}`).emit("order:status", {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt
        });
        io.to(`user:${order.user}`).emit("order:status", {
            orderId: order._id,
            status: order.status,
            updatedAt: order.updatedAt
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Order status updated successfully",
            order
        )
    );
});


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getRestaurantOrders,
    updateOrderStatus
};