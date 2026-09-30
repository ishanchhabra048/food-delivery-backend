const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        cuisine: {
            type: String,
            trim: true,
            default: ""
        },

        address: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" }
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isOpen: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
