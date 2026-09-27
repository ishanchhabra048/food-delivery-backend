const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    refreshAccessToken,
    updateAccountDetails,
    getAllUsers
} = require("../controllers/user.controller");

const {
    verifyJWT,
    checkRole
} = require("../middlewares/auth.middleware");

const {
    validate
} = require("../middlewares/validate.middleware");

const {
    registerUserSchema,
    loginUserSchema,
    changePasswordSchema,
    updateProfileSchema,
    getUsersQuerySchema
} = require("../validations/user.validation");

const {
    authLimiter
} = require("../middlewares/rateLimiter.middleware");

router.post(
    "/register",
    authLimiter,
    validate(registerUserSchema),
    registerUser
);

router.post(
    "/login",
    authLimiter,
    validate(loginUserSchema),
    loginUser
);

router.post(
    "/logout",
    verifyJWT,
    logoutUser
);

router.get(
    "/me",
    verifyJWT,
    getCurrentUser
);

router.patch(
    "/change-password",
    verifyJWT,
    validate(changePasswordSchema),
    changePassword
);

router.patch(
    "/update-profile",
    verifyJWT,
    validate(updateProfileSchema),
    updateAccountDetails
);

router.post(
    "/refresh-token",
    authLimiter,
    refreshAccessToken
);

router.get(
    "/",
    verifyJWT,
    checkRole("admin"),
    validate(getUsersQuerySchema, "query"),
    getAllUsers
);

module.exports = router;