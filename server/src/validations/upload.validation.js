const { z } = require("zod");

const uploadQuerySchema = z.object({
    type: z.enum(["food", "restaurant"]).optional().default("restaurant")
});

const deleteImageParamSchema = z.object({
    publicId: z.string().min(1, "Public ID is required")
});

module.exports = {
    uploadQuerySchema,
    deleteImageParamSchema
};
