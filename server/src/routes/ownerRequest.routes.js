const express = require("express");

const router = express.Router();

const {
    createOwnerRequest,
    getOwnerRequests,
    approveOwnerRequest,
    rejectOwnerRequest,
    getMyOwnerRequest
} = require("../controllers/ownerRequest.controller");

const {
    verifyJWT,
    checkRole
} = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
    createOwnerRequestSchema,
    ownerRequestIdParamSchema,
    getOwnerRequestsQuerySchema
} = require("../validations/ownerRequest.validation");

router.post(
    "/",
    verifyJWT,
    validate(createOwnerRequestSchema),
    createOwnerRequest
);

router.get(
    "/",
    verifyJWT,
    checkRole("admin"),
    validate(getOwnerRequestsQuerySchema, "query"),
    getOwnerRequests
);

router.patch(
    "/approve/:id",
    verifyJWT,
    checkRole("admin"),
    validate(ownerRequestIdParamSchema, "params"),
    approveOwnerRequest
);

router.patch(
    "/reject/:id",
    verifyJWT,
    checkRole("admin"),
    validate(ownerRequestIdParamSchema, "params"),
    rejectOwnerRequest
);

router.get(
    "/my-request",
    verifyJWT,
    getMyOwnerRequest
);

module.exports = router;