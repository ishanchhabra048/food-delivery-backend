const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const uploadBufferToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "No image file provided");
    }

    const type = req.query.type || req.body.type;
    const folder = type === "food" ? "food-delivery/foods" : "food-delivery/restaurants";

    try {
        const result = await uploadBufferToCloudinary(req.file.buffer, folder);
        return res.status(201).json(
            new ApiResponse(201, "Image uploaded successfully", {
                url: result.secure_url,
                publicId: result.public_id
            })
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Cloudinary upload failed");
    }
});

const deleteImage = asyncHandler(async (req, res) => {
    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    if (!decodedPublicId) {
        throw new ApiError(400, "Public ID is required");
    }

    try {
        await cloudinary.uploader.destroy(decodedPublicId);
        return res.status(200).json(
            new ApiResponse(200, "Image deleted successfully", {})
        );
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to delete image from Cloudinary");
    }
});

module.exports = {
    uploadImage,
    deleteImage,
    uploadBufferToCloudinary
};
