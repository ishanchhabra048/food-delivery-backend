require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("../models/restaurant.model");
const Food = require("../models/food.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/food-delivery";

const migrateImageFields = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for image field migration.");

        // Migrate restaurants
        const restaurants = await Restaurant.find({});
        for (const r of restaurants) {
            if (typeof r.image === "string") {
                r.image = { url: r.image, publicId: "" };
                await r.save();
            }
        }
        console.log(`Migrated ${restaurants.length} restaurants.`);

        // Migrate foods
        const foods = await Food.find({});
        for (const f of foods) {
            if (typeof f.image === "string") {
                f.image = { url: f.image, publicId: "" };
                await f.save();
            }
        }
        console.log(`Migrated ${foods.length} foods.`);

        console.log("Image migration completed successfully.");
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Image migration failed:", error);
        process.exit(1);
    }
};

migrateImageFields();
