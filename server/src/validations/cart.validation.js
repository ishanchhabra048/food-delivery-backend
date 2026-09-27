const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addToCartSchema = z.object({
    foodId: z
        .string({ required_error: "Food ID is required" })
        .regex(objectIdRegex, "Invalid food ID format"),

    quantity: z.coerce
        .number({ required_error: "Quantity is required" })
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1")
        .default(1)
});

const updateCartQuantitySchema = z.object({
    foodId: z
        .string({ required_error: "Food ID is required" })
        .regex(objectIdRegex, "Invalid food ID format"),

    quantity: z.coerce
        .number({ required_error: "Quantity is required" })
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1")
});

const removeFromCartSchema = z.object({
    foodId: z
        .string({ required_error: "Food ID is required" })
        .regex(objectIdRegex, "Invalid food ID format")
});

module.exports = {
    addToCartSchema,
    updateCartQuantitySchema,
    removeFromCartSchema
};
