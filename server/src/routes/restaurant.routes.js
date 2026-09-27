const express = require("express");

const router = express.Router();

const {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} = require("../controllers/restaurant.controller");

const {
    verifyJWT,
    checkRole
} = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

const {
    createRestaurantSchema,
    updateRestaurantSchema,
    restaurantIdParamSchema,
    getRestaurantsQuerySchema
} = require("../validations/restaurant.validation");

router.post(
    "/",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(createRestaurantSchema),
    createRestaurant
);

router.get(
    "/",
    validate(getRestaurantsQuerySchema, "query"),
    getAllRestaurants
);

router.get(
    "/:id",
    validate(restaurantIdParamSchema, "params"),
    getRestaurantById
);

router.patch(
    "/:id",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(restaurantIdParamSchema, "params"),
    validate(updateRestaurantSchema),
    updateRestaurant
);

router.delete(
    "/:id",
    verifyJWT,
    checkRole("restaurantOwner"),
    validate(restaurantIdParamSchema, "params"),
    deleteRestaurant
);

module.exports = router;
