const express = require("express");

const {
    addAddress,
    getMyAddresses,
    getAddressById,
    updateAddress,
    deleteAddress
} = require("../controllers/address.controller");

const { verifyJWT } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
    addAddressSchema,
    updateAddressSchema,
    addressIdParamSchema
} = require("../validations/address.validation");

const router = express.Router();

router.post(
    "/",
    verifyJWT,
    validate(addAddressSchema),
    addAddress
);

router.get(
    "/",
    verifyJWT,
    getMyAddresses
);

router.get(
    "/:id",
    verifyJWT,
    validate(addressIdParamSchema, "params"),
    getAddressById
);

router.patch(
    "/:id",
    verifyJWT,
    validate(addressIdParamSchema, "params"),
    validate(updateAddressSchema),
    updateAddress
);

router.delete(
    "/:id",
    verifyJWT,
    validate(addressIdParamSchema, "params"),
    deleteAddress
);

module.exports = router;