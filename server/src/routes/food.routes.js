const express = require("express");

const router = express.Router();

const {
    createFood,
    getAllFood,
    getFoodById,
    updateFood,
    deleteFood
} = require("../controllers/food.controller");

const {
    verifyJWT,
    checkRole
} = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
    createFoodSchema,
    updateFoodSchema,
    foodIdParamSchema,
    getFoodsQuerySchema
} = require("../validations/food.validation");

router.post(
    "/",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(createFoodSchema),
    createFood
);

router.get(
    "/",
    validate(getFoodsQuerySchema, "query"),
    getAllFood
);

router.get(
    "/:id",
    validate(foodIdParamSchema, "params"),
    getFoodById
);

router.patch(
    "/:id",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(foodIdParamSchema, "params"),
    validate(updateFoodSchema),
    updateFood
);

router.delete(
    "/:id",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(foodIdParamSchema, "params"),
    deleteFood
);

module.exports = router;