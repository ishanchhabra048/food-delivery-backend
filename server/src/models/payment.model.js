const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        gatewayOrderId: {
            type: String
        },

        gatewayPaymentId: {
            type: String
        },

        paymentSessionId: {
            type: String
        },

        status: {
            type: String,
            enum: ["CREATED", "PENDING", "SUCCESS", "FAILED"],
            default: "CREATED"
        }
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;