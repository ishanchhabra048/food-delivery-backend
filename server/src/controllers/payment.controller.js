const crypto = require("crypto");

const axios = require("axios");

const {
    CASHFREE_BASE_URL,
    cashfreeHeaders
} = require("../config/cashfree");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const Payment = require("../models/payment.model");
const Order = require("../models/order.model");


// ==================== CREATE PAYMENT ====================

const createPayment = asyncHandler(async (req, res) => {

    const { orderId } = req.body;

    // 1. Check order ID
    if (!orderId) {
        throw new ApiError(
            400,
            "Order ID is required"
        );
    }

    // 2. Find user's order
    const order = await Order.findOne({
        _id: orderId,
        user: req.user._id
    }).populate("user");

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    // 3. Check if order is already paid
    if (order.paymentStatus === "PAID") {
        throw new ApiError(
            400,
            "Order is already paid"
        );
    }

    // 4. Find existing payment
    let payment = await Payment.findOne({
        order: order._id,
        user: req.user._id
    });

    // 5. Don't allow payment if already successful
    if (payment && payment.status === "SUCCESS") {
        throw new ApiError(
            400,
            "Payment is already completed"
        );
    }

    // 6. Create payment record if it doesn't exist
    if (!payment) {
        payment = await Payment.create({
            order: order._id,
            user: req.user._id,
            amount: order.totalAmount,
            status: "CREATED"
        });
    }

    // 7. Use existing gateway order ID if available
    // Otherwise create a new one
    const cashfreeOrderId =
        payment.gatewayOrderId ||
        `ORDER_${order._id}`;

    // 8. Create order on Cashfree
    const response = await axios.post(
        `${CASHFREE_BASE_URL}/orders`,
        {
            order_id: cashfreeOrderId,
            order_amount: order.totalAmount,
            order_currency: "INR",

            customer_details: {
                customer_id: req.user._id.toString(),
                customer_name: order.user.fullName,
                customer_email: order.user.email,
                customer_phone: order.user.phoneNumber
            },

            order_meta: {
                return_url:
                    `http://localhost:5000/api/payments/callback?order_id=${cashfreeOrderId}`
            }
        },
        {
            headers: cashfreeHeaders
        }
    );

    // 9. Save Cashfree details
    payment.gatewayOrderId = cashfreeOrderId;

    payment.paymentSessionId =
        response.data.payment_session_id;

    payment.status = "PENDING";

    await payment.save();

    // 10. Send payment session to frontend
    return res.status(201).json(
        new ApiResponse(
            201,
            "Payment order created successfully",
            {
                paymentId: payment._id,
                orderId: order._id,
                amount: order.totalAmount,
                paymentSessionId:
                    response.data.payment_session_id
            }
        )
    );
});


// ==================== VERIFY PAYMENT ====================

const verifyPayment = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    // 1. Check order ID
    if (!orderId) {
        throw new ApiError(
            400,
            "Order ID is required"
        );
    }

    // 2. Find user's order
    const order = await Order.findOne({
        _id: orderId,
        user: req.user._id
    });

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    // 3. Find payment
    const payment = await Payment.findOne({
        order: order._id,
        user: req.user._id
    });

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found"
        );
    }

    // 4. Cashfree order must exist
    if (!payment.gatewayOrderId) {
        throw new ApiError(
            400,
            "Cashfree order has not been created"
        );
    }

    // 5. Ask Cashfree for payment status
    const response = await axios.get(
        `${CASHFREE_BASE_URL}/orders/${payment.gatewayOrderId}/payments`,
        {
            headers: cashfreeHeaders
        }
    );

    const transactions = response.data;

    // 6. Check transaction
    if (
        !transactions ||
        transactions.length === 0
    ) {
        throw new ApiError(
            400,
            "Payment transaction not found"
        );
    }

    const transaction = transactions[0];

    // 7. Payment successful
    if (
        transaction.payment_status === "SUCCESS"
    ) {

        payment.status = "SUCCESS";

        payment.gatewayPaymentId =
            transaction.cf_payment_id;

        await payment.save();

        order.paymentStatus = "PAID";

        await order.save();

    }

    // 8. Payment failed
    else if (
        transaction.payment_status === "FAILED"
    ) {

        payment.status = "FAILED";

        await payment.save();

        order.paymentStatus = "FAILED";

        await order.save();

    }

    // 9. Payment still pending
    else {

        payment.status = "PENDING";

        await payment.save();
    }

    // 10. Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Payment status fetched successfully",
            {
                paymentStatus: payment.status,
                orderPaymentStatus:
                    order.paymentStatus,
                transaction
            }
        )
    );
});

// ==================== CASHFREE WEBHOOK ====================

const handleWebhook = asyncHandler(async (req, res) => {

    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    // 1. Check required headers
    if (!signature || !timestamp) {
        return res.status(400).json({
            success: false,
            message: "Missing webhook signature or timestamp"
        });
    }

    // 2. Get raw request body
    const rawBody = req.rawBody;

    if (!rawBody) {
        return res.status(400).json({
            success: false,
            message: "Raw request body not found"
        });
    }

    // 3. Generate signature
    const signatureData =
        timestamp + rawBody.toString();

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            process.env.CASHFREE_WEBHOOK_SECRET ||
            process.env.CASHFREE_CLIENT_SECRET
        )
        .update(signatureData)
        .digest("base64");

    // 4. Compare signatures
    if (expectedSignature !== signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid webhook signature"
        });
    }

    // 5. Parse webhook body
    const webhookData = req.body;

    console.log("Cashfree webhook received:");
    console.log(webhookData);

    // 6. Get webhook order information
    const orderId =
        webhookData?.data?.order?.order_id;

    const paymentStatus =
        webhookData?.data?.payment?.payment_status;

    const paymentId =
        webhookData?.data?.payment?.cf_payment_id;

    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: "Order ID not found in webhook"
        });
    }

    // 7. Find our payment using Cashfree order ID
    const payment = await Payment.findOne({
        gatewayOrderId: orderId
    });

    if (!payment) {
        return res.status(404).json({
            success: false,
            message: "Payment not found"
        });
    }

    // 8. Find our order
    const order = await Order.findById(
        payment.order
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    // 9. Handle successful payment
    if (paymentStatus === "SUCCESS") {

        // Idempotency:
        // Don't process an already successful payment again
        if (payment.status !== "SUCCESS") {

            payment.status = "SUCCESS";
            payment.gatewayPaymentId = paymentId;

            await payment.save();

            order.paymentStatus = "PAID";

            await order.save();
        }
    }

    // 10. Handle failed payment
    else if (paymentStatus === "FAILED") {

        payment.status = "FAILED";

        await payment.save();

        order.paymentStatus = "FAILED";

        await order.save();
    }

    // 11. Handle pending payment
    else {

        payment.status = "PENDING";

        await payment.save();
    }

    // 12. Tell Cashfree webhook was received
    return res.status(200).json({
        success: true,
        message: "Webhook processed successfully"
    });
});

const handlePaymentCallback = asyncHandler(async (req, res) => {
    const { order_id } = req.query;

    if (!order_id) {
        throw new ApiError(400, "Order ID is required");
    }

    const payment = await Payment.findOne({
        gatewayOrderId: order_id
    });

    if (!payment) {
        throw new ApiError(404, "Payment not found");
    }

    const order = await Order.findById(payment.order);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Payment status retrieved successfully",
            {
                orderId: payment.order,
                paymentStatus: payment.status,
                orderPaymentStatus: order?.paymentStatus || payment.status
            }
        )
    );
});

module.exports = {
    createPayment,
    verifyPayment,
    handleWebhook,
    handlePaymentCallback
};