const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const addAddressSchema = z.object({
    fullName: z
        .string({ required_error: "Full name is required" })
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters")
        .trim(),

    phoneNumber: z
        .string({ required_error: "Phone number is required" })
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid Indian phone number"
        ),

    addressLine: z
        .string({ required_error: "Address line is required" })
        .min(3, "Address line must be at least 3 characters")
        .max(200, "Address line must not exceed 200 characters")
        .trim(),

    city: z
        .string({ required_error: "City is required" })
        .min(2, "City must be at least 2 characters")
        .max(50, "City must not exceed 50 characters")
        .trim(),

    state: z
        .string({ required_error: "State is required" })
        .min(2, "State must be at least 2 characters")
        .max(50, "State must not exceed 50 characters")
        .trim(),

    pincode: z
        .string({ required_error: "Pincode is required" })
        .regex(
            /^\d{6}$/,
            "Pincode must be exactly 6 digits"
        )
        .trim(),

    label: z
        .enum(["Home", "Work", "Other"])
        .optional()
        .default("Home")
});

const updateAddressSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters")
        .trim()
        .optional(),

    phoneNumber: z
        .string()
        .regex(
            /^[6-9]\d{9}$/,
            "Invalid Indian phone number"
        )
        .optional(),

    addressLine: z
        .string()
        .min(3, "Address line must be at least 3 characters")
        .max(200, "Address line must not exceed 200 characters")
        .trim()
        .optional(),

    city: z
        .string()
        .min(2, "City must be at least 2 characters")
        .max(50, "City must not exceed 50 characters")
        .trim()
        .optional(),

    state: z
        .string()
        .min(2, "State must be at least 2 characters")
        .max(50, "State must not exceed 50 characters")
        .trim()
        .optional(),

    pincode: z
        .string()
        .regex(
            /^\d{6}$/,
            "Pincode must be exactly 6 digits"
        )
        .trim()
        .optional(),

    label: z
        .enum(["Home", "Work", "Other"])
        .optional()
});

const addressIdParamSchema = z.object({
    id: z
        .string({ required_error: "Address ID is required" })
        .regex(objectIdRegex, "Invalid address ID format")
});

module.exports = {
    addAddressSchema,
    updateAddressSchema,
    addressIdParamSchema
};
