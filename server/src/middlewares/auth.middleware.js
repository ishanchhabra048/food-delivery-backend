const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

const verifyJWT = async (req, res, next) => {

    try {

        // 1. Get access token
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // 2. Verify token
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // 3. Find user
        const user = await User.findById(decodedToken._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        // 4. Attach user to request
        req.user = user;

        // 5. Continue
        next();

    } catch (error) {
        return next(
            new ApiError(
                401,
                error.message || "Invalid access token"
            )
        );
    }
};

const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, "Forbidden"));
        }
        next();
    };
};

module.exports = {verifyJWT, checkRole};