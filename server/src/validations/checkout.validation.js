const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const checkoutQuerySchema = z.object({
    addressId: z
        .string({ required_error: "Address ID is required" })
        .regex(objectIdRegex, "Invalid address ID format")
});

module.exports = {
    checkoutQuerySchema,
    checkoutSchema: checkoutQuerySchema
};
