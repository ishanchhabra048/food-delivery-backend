const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const OwnerRequest = require("../models/ownerRequest.model");

const getAdminStats = asyncHandler(async (req, res) => {
    const [users, restaurants, pendingOwnerRequests] = await Promise.all([
        User.countDocuments(),
        Restaurant.countDocuments(),
        OwnerRequest.countDocuments({ status: "PENDING" })
    ]);

    return res.status(200).json(
        new ApiResponse(200, "Admin stats fetched successfully", {
            users,
            restaurants,
            pendingOwnerRequests
        })
    );
});

module.exports = {
    getAdminStats
};
