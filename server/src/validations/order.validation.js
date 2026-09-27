const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createOrderSchema = z.object({
    addressId: z
        .string({ required_error: "Address ID is required" })
        .regex(objectIdRegex, "Invalid address ID format")
});

const updateOrderStatusSchema = z.object({
    status: z.enum(
        [
            "CONFIRMED",
            "PREPARING",
            "OUT_FOR_DELIVERY",
            "DELIVERED"
        ],
        {
            errorMap: () => ({
                message:
                    "Status must be one of: CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED"
            })
        }
    )
});

const orderIdParamSchema = z.object({
    id: z
        .string({ required_error: "Order ID is required" })
        .regex(objectIdRegex, "Invalid order ID format")
});

const getOrdersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    status: z.enum([
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
    ]).optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
    sortBy: z.enum(["totalAmount", "createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

module.exports = {
    createOrderSchema,
    updateOrderStatusSchema,
    orderIdParamSchema,
    getOrdersQuerySchema
};
