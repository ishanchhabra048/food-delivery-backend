const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // Which customer placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Restaurant from which the order was placed
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },

        // Saved address selected for this order
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        },

        // Food items in the order
        items: [
            {
                food: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Food",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                // Price at the time of ordering
                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        // Total price of all food items
        itemTotal: {
            type: Number,
            required: true
        },

        // Delivery charge
        deliveryFee: {
            type: Number,
            required: true,
            default: 40
        },

        // Tax amount
        tax: {
            type: Number,
            required: true,
            default: 0
        },

        // Final amount customer has to pay
        totalAmount: {
            type: Number,
            required: true
        },

        // Delivery address snapshot
        deliveryAddress: {
            type: String,
            required: true
        },

        // Order status
        status: {
            type: String,
            enum: [
                "PLACED",
                "CONFIRMED",
                "PREPARING",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "PLACED"
        },

        // Payment status
        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
                "FAILED"
            ],
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;