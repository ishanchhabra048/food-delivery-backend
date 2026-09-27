const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createOwnerRequestSchema = z.object({
    reason: z
        .string({ required_error: "Reason is required" })
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason must not exceed 500 characters")
        .trim()
});

const ownerRequestIdParamSchema = z.object({
    id: z
        .string({ required_error: "Owner request ID is required" })
        .regex(objectIdRegex, "Invalid owner request ID format")
});

const getOwnerRequestsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    sortBy: z.enum(["createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

module.exports = {
    createOwnerRequestSchema,
    ownerRequestIdParamSchema,
    getOwnerRequestsQuerySchema
};
