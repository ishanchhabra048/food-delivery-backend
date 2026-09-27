const { z } = require("zod");

const registerUserSchema = z.object({
    fullName: z
        .string({ required_error: "Full name is required" })
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters")
        .trim(),

    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters"),

    phoneNumber: z
        .string({ required_error: "Phone number is required" })
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid Indian phone number"
        ),

    role: z
        .enum(["User", "restaurantOwner", "admin"])
        .optional()
        .default("User")
});

const loginUserSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required")
});

const changePasswordSchema = z.object({
    currentPassword: z
        .string({ required_error: "Current password is required" })
        .min(1, "Current password is required"),

    newPassword: z
        .string({ required_error: "New password is required" })
        .min(6, "New password must be at least 6 characters")
});

const updateProfileSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters")
        .trim()
        .optional(),

    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim()
        .optional(),

    email: z
        .string()
        .email("Invalid email address")
        .trim()
        .toLowerCase()
        .optional(),

    phoneNumber: z
        .string()
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid Indian phone number"
        )
        .optional()
});

const getUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    role: z.enum(["User", "restaurantOwner", "admin"]).optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(["fullName", "email", "createdAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

module.exports = {
    registerUserSchema,
    loginUserSchema,
    changePasswordSchema,
    updateProfileSchema,
    getUsersQuerySchema
};
