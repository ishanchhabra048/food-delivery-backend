const express = require("express");

const {
    createPayment,
    verifyPayment,
    handleWebhook,
    handlePaymentCallback
} = require("../controllers/payment.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    createPaymentSchema,
    verifyPaymentParamSchema
} = require("../validations/payment.validation");

const {
    paymentLimiter
} = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

// Create payment
router.post(
    "/create",
    paymentLimiter,
    verifyJWT,
    validate(createPaymentSchema),
    createPayment
);

// Verify payment
router.post(
    "/verify/:orderId",
    paymentLimiter,
    verifyJWT,
    validate(verifyPaymentParamSchema, "params"),
    verifyPayment
);

// Payment callback (Cashfree redirect return_url)
router.get(
    "/callback",
    handlePaymentCallback
);

// Cashfree webhook
router.post(
    "/webhook",
    handleWebhook
);

module.exports = router;