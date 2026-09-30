const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const imageSchema = z
    .union([
        z.string(),
        z.object({
            url: z.string().optional().default(""),
            publicId: z.string().optional().default("")
        })
    ])
    .optional();

const createRestaurantSchema = z.object({
    name: z
        .string({ required_error: "Restaurant name is required" })
        .min(2, "Restaurant name must be at least 2 characters")
        .max(100, "Restaurant name must not exceed 100 characters")
        .trim(),

    description: z
        .string()
        .max(500, "Description must not exceed 500 characters")
        .trim()
        .optional(),

    cuisine: z
        .string()
        .max(100, "Cuisine must not exceed 100 characters")
        .trim()
        .optional(),

    address: z
        .string({ required_error: "Address is required" })
        .min(5, "Address must be at least 5 characters")
        .max(300, "Address must not exceed 300 characters")
        .trim(),

    image: imageSchema,

    isOpen: z
        .boolean()
        .optional()
        .default(true)
});

const updateRestaurantSchema = z.object({
    name: z
        .string()
        .min(2, "Restaurant name must be at least 2 characters")
        .max(100, "Restaurant name must not exceed 100 characters")
        .trim()
        .optional(),

    description: z
        .string()
        .max(500, "Description must not exceed 500 characters")
        .trim()
        .optional(),

    cuisine: z
        .string()
        .max(100, "Cuisine must not exceed 100 characters")
        .trim()
        .optional(),

    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(300, "Address must not exceed 300 characters")
        .trim()
        .optional(),

    image: imageSchema,

    isOpen: z
        .boolean()
        .optional()
});

const restaurantIdParamSchema = z.object({
    id: z
        .string({ required_error: "Restaurant ID is required" })
        .regex(objectIdRegex, "Invalid restaurant ID format")
});

const getRestaurantsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().trim().optional(),
    cuisine: z.string().trim().optional(),
    category: z.string().trim().optional(),
    isOpen: z.enum(["true", "false"]).optional(),
    sortBy: z.enum(["name", "createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

module.exports = {
    createRestaurantSchema,
    updateRestaurantSchema,
    restaurantIdParamSchema,
    getRestaurantsQuerySchema
};
