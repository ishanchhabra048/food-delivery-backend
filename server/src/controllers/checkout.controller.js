const Cart = require("../models/cart.model");
const Address = require("../models/address.model");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");


// ==========================================
// GET CHECKOUT SUMMARY
// GET /api/checkout?addressId=ADDRESS_ID
// ==========================================
const getCheckout = asyncHandler(async (req, res) => {
    const { addressId } = req.query;

    // 1. Check address
    if (!addressId) {
        throw new ApiError(400, "Address is required");
    }

    const address = await Address.findOne({
        _id: addressId,
        user: req.user._id
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }


    // 2. Get user's cart
    const cart = await Cart.findOne({
        user: req.user._id
    }).populate("items.food");

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    if (cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
    }


    // 3. Check food existence and availability
    const missingItems = cart.items.filter((item) => !item.food);
    if (missingItems.length > 0) {
        throw new ApiError(
            400,
            "Some items in your cart are no longer available. Please update your cart."
        );
    }

    const unavailableItems = cart.items.filter(
        (item) => !item.food.isAvailable
    );

    if (unavailableItems.length > 0) {
        throw new ApiError(
            400,
            "Some items in your cart are currently unavailable"
        );
    }


    // 4. Calculate item total
    let itemTotal = 0;

    const items = cart.items.map((item) => {
        const subtotal = item.food.price * item.quantity;

        itemTotal += subtotal;

        return {
            food: item.food._id,
            name: item.food.name,
            price: item.food.price,
            quantity: item.quantity,
            subtotal
        };
    });


    // 5. Check all items belong to same restaurant
    const restaurantId = cart.items[0].food.restaurant;

    const isSameRestaurant = cart.items.every(
        (item) =>
            item.food.restaurant.toString() ===
            restaurantId.toString()
    );

    if (!isSameRestaurant) {
        throw new ApiError(
            400,
            "All items must belong to the same restaurant"
        );
    }


    // 6. Delivery fee
    const deliveryFee = 40;


    // 7. Tax
    const tax = Math.round(itemTotal * 0.05);


    // 8. Final amount
    const totalAmount =
        itemTotal +
        deliveryFee +
        tax;


    // 9. Return checkout summary
    return res.status(200).json(
        new ApiResponse(
            200,
            "Checkout details fetched successfully",
            {
                items,
                restaurant: restaurantId,
                address,
                itemTotal,
                deliveryFee,
                tax,
                totalAmount
            }
        )
    );
});


module.exports = {
    getCheckout
};