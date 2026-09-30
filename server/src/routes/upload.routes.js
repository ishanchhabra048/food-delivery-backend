const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { uploadImage, deleteImage } = require("../controllers/upload.controller");
const { verifyJWT, checkRole } = require("../middlewares/auth.middleware");

// Both restaurant owners and admins can upload/delete images
router.post(
    "/image",
    verifyJWT,
    checkRole("restaurantOwner", "admin"),
    upload.single("image"),
    uploadImage
);

router.delete(
    "/image/:publicId",
    verifyJWT,
    checkRole("restaurantOwner", "admin"),
    deleteImage
);

module.exports = router;
