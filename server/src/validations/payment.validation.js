const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createPaymentSchema = z.object({
    orderId: z
        .string({ required_error: "Order ID is required" })
        .regex(objectIdRegex, "Invalid order ID format")
});

const verifyPaymentParamSchema = z.object({
    orderId: z
        .string({ required_error: "Order ID is required" })
        .regex(objectIdRegex, "Invalid order ID format")
});

module.exports = {
    createPaymentSchema,
    verifyPaymentParamSchema
};
