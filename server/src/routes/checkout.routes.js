const express = require("express");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { getCheckout } = require("../controllers/checkout.controller");
const validate = require("../middlewares/validate.middleware");
const { checkoutQuerySchema } = require("../validations/checkout.validation");

const router = express.Router();

router.get(
    "/",
    verifyJWT,
    validate(checkoutQuerySchema, "query"),
    getCheckout
);

module.exports = router;