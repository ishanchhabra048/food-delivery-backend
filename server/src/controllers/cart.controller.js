const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Cart = require("../models/cart.model");
const Food = require("../models/food.model");
const Restaurant = require("../models/restaurant.model");

const addToCart = asyncHandler(async (req, res) => {

    // 1. Get food and quantity
    const { foodId, quantity } = req.body;

    // 2. Validate
    if (!foodId || !quantity) {
        throw new ApiError(
            400,
            "Food ID and quantity are required"
        );
    }

    // 3. Check food exists
    const food = await Food.findById(foodId);

    if (!food) {
        throw new ApiError(404, "Food not found");
    }

    // 4. Check food is available
    if (!food.isAvailable) {
        throw new ApiError(400, "Food is currently unavailable");
    }

    // 5. Find user's cart
    let cart = await Cart.findOne({
        user: req.user._id
    });

    // 6. If cart doesn't exist, create one
    if (!cart) {

        cart = await Cart.create({
            user: req.user._id,
            items: [
                {
                    food: foodId,
                    quantity: quantity
                }
            ]
        });

    } else {

        // 7. Check if food already exists in cart
        const existingItem = cart.items.find(
            item => item.food.toString() === foodId
        );

        if (existingItem) {

            // Increase quantity
            existingItem.quantity += quantity;

        } else {

            // Add new food
            cart.items.push({
                food: foodId,
                quantity: quantity
            });
        }

        await cart.save();
    }

    // 8. Return updated cart
    const updatedCart = await Cart.findById(cart._id)
        .populate("items.food");

    return res.status(200).json(
        new ApiResponse(
            200,
            "Food added to cart successfully",
            updatedCart
        )
    );
});

const getCart = asyncHandler(async (req, res) => {
   const cart = await Cart.findOne({
    user:req.user._id
   }).populate("items.food");

   if(!cart){
    return res.status(200).json(
        new ApiResponse(
            200,
            "Cart is empty",
            { items: [] }
        )
    )
   }

   return res.status(200).json(
        new ApiResponse(
            200,
            "Cart fetched successfully",
            cart
        )
    );
   
});

const updateCartQuantity = asyncHandler(async (req, res) => {

    const { foodId, quantity } = req.body;

    // 1. Validate
    if (!foodId || !quantity || quantity < 1) {
        throw new ApiError(
            400,
            "Food ID and valid quantity are required"
        );
    }

    // 2. Find user's cart
    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // 3. Find food inside cart
    const item = cart.items.find(
        item => item.food.toString() === foodId
    );

    if (!item) {
        throw new ApiError(404, "Food is not in your cart");
    }

    // 4. Update quantity
    item.quantity = quantity;

    // 5. Save
    await cart.save();

    // 6. Get updated cart
    const updatedCart = await Cart.findById(cart._id)
        .populate("items.food");

    return res.status(200).json(
        new ApiResponse(
            200,
            "Cart quantity updated successfully",
            updatedCart
        )
    );
});
const removeFromCart = asyncHandler(async (req, res) => {

    const { foodId } = req.body;

    // 1. Validate
    if (!foodId) {
        throw new ApiError(400, "Food ID is required");
    }

    // 2. Find user's cart
    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // 3. Check food exists in cart
    const itemExists = cart.items.some(
        item => item.food.toString() === foodId
    );

    if (!itemExists) {
        throw new ApiError(404, "Food is not in your cart");
    }

    // 4. Remove food
    cart.items = cart.items.filter(
        item => item.food.toString() !== foodId
    );

    // 5. Save cart
    await cart.save();

    // 6. Get updated cart
    const updatedCart = await Cart.findById(cart._id)
        .populate("items.food");

    return res.status(200).json(
        new ApiResponse(
            200,
            "Food removed from cart successfully",
            updatedCart
        )
    );
});


const clearCart = asyncHandler(async (req, res) => {

    // 1. Find user's cart
    const cart = await Cart.findOne({
        user: req.user._id
    });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // 2. Remove all items
    cart.items = [];

    // 3. Save
    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Cart cleared successfully",
            {}
        )
    );
});


module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart   
}