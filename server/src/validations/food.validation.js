const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createFoodSchema = z.object({
    name: z
        .string({ required_error: "Food name is required" })
        .min(2, "Food name must be at least 2 characters")
        .max(100, "Food name must not exceed 100 characters")
        .trim(),

    description: z
        .string()
        .max(500, "Description must not exceed 500 characters")
        .trim()
        .optional(),

    price: z.coerce
        .number({ required_error: "Price is required" })
        .positive("Price must be a positive number"),

    category: z
        .string({ required_error: "Category is required" })
        .min(2, "Category must be at least 2 characters")
        .max(50, "Category must not exceed 50 characters")
        .trim(),

    restaurantId: z
        .string({ required_error: "Restaurant ID is required" })
        .regex(objectIdRegex, "Invalid restaurant ID format"),

    image: z
        .union([
            z.string(),
            z.object({
                url: z.string().optional().default(""),
                publicId: z.string().optional().default("")
            })
        ])
        .optional(),

    isAvailable: z
        .boolean()
        .optional()
        .default(true)
});

const updateFoodSchema = z.object({
    name: z
        .string()
        .min(2, "Food name must be at least 2 characters")
        .max(100, "Food name must not exceed 100 characters")
        .trim()
        .optional(),

    description: z
        .string()
        .max(500, "Description must not exceed 500 characters")
        .trim()
        .optional(),

    price: z.coerce
        .number()
        .positive("Price must be a positive number")
        .optional(),

    category: z
        .string()
        .min(2, "Category must be at least 2 characters")
        .max(50, "Category must not exceed 50 characters")
        .trim()
        .optional(),

    image: z
        .union([
            z.string(),
            z.object({
                url: z.string().optional().default(""),
                publicId: z.string().optional().default("")
            })
        ])
        .optional(),

    isAvailable: z
        .boolean()
        .optional()
});

const foodIdParamSchema = z.object({
    id: z
        .string({ required_error: "Food ID is required" })
        .regex(objectIdRegex, "Invalid food ID format")
});

const getFoodsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    category: z.string().trim().optional(),
    restaurantId: z.string().regex(objectIdRegex, "Invalid restaurant ID format").optional(),
    search: z.string().trim().optional(),
    minPrice: z.coerce.number().min(0, "minPrice cannot be negative").optional(),
    maxPrice: z.coerce.number().min(0, "maxPrice cannot be negative").optional(),
    isAvailable: z.enum(["true", "false"]).optional(),
    sortBy: z.enum(["price", "name", "createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

module.exports = {
    createFoodSchema,
    updateFoodSchema,
    foodIdParamSchema,
    getFoodsQuerySchema
};
