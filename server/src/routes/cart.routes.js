const express = require("express");

const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
} = require("../controllers/cart.controller");

const {
    verifyJWT
} = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
    addToCartSchema,
    updateCartQuantitySchema,
    removeFromCartSchema
} = require("../validations/cart.validation");

router.post(
    "/",
    verifyJWT,
    validate(addToCartSchema),
    addToCart
);

router.get(
    "/",
    verifyJWT,
    getCart
);

router.patch(
    "/update",
    verifyJWT,
    validate(updateCartQuantitySchema),
    updateCartQuantity
);

router.delete(
    "/remove",
    verifyJWT,
    validate(removeFromCartSchema),
    removeFromCart
);

router.delete(
    "/clear",
    verifyJWT,
    clearCart
);

module.exports = router;