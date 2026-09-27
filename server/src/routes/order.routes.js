const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getRestaurantOrders,
    updateOrderStatus
} = require("../controllers/order.controller");

const { verifyJWT, checkRole } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdParamSchema,
    getOrdersQuerySchema
} = require("../validations/order.validation");

router.post(
    "/",
    verifyJWT,
    validate(createOrderSchema),
    createOrder
);

router.get(
    "/",
    verifyJWT,
    validate(getOrdersQuerySchema, "query"),
    getMyOrders
);

router.get(
    "/restaurant",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(getOrdersQuerySchema, "query"),
    getRestaurantOrders
);

router.get(
    "/:id",
    verifyJWT,
    validate(orderIdParamSchema, "params"),
    getOrderById
);

router.patch(
    "/:id/cancel",
    verifyJWT,
    validate(orderIdParamSchema, "params"),
    cancelOrder
);

router.patch(
    "/:id/status",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(orderIdParamSchema, "params"),
    validate(updateOrderStatusSchema),
    updateOrderStatus
);

module.exports = router;