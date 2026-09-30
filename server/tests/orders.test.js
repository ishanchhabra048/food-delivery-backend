const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Restaurant = require("../src/models/restaurant.model");
const Food = require("../src/models/food.model");
const Cart = require("../src/models/cart.model");
const Address = require("../src/models/address.model");
const Order = require("../src/models/order.model");

describe("Orders & Cart Clearing Test Suite", () => {
    let customerUser, ownerUser, restaurant, foodItem, address, customerToken;

    beforeEach(async () => {
        customerUser = await User.create({
            fullName: "Order Tester",
            email: "ordertester@test.com",
            password: "Password123!",
            phoneNumber: "9876543210",
            role: "User"
        });
        customerToken = customerUser.generateAccessToken();

        ownerUser = await User.create({
            fullName: "Owner Tester",
            email: "ownertester@test.com",
            password: "Password123!",
            phoneNumber: "9876543211",
            role: "restaurantOwner"
        });

        restaurant = await Restaurant.create({
            name: "Test Trattoria",
            address: "100 Pasta Lane",
            owner: ownerUser._id,
            isOpen: true
        });

        foodItem = await Food.create({
            name: "Test Carbonara",
            price: 250,
            category: "Mains",
            restaurant: restaurant._id,
            isAvailable: true
        });

        address = await Address.create({
            user: customerUser._id,
            fullName: "Order Tester",
            phoneNumber: "9876543210",
            addressLine: "100 Test St",
            city: "Test City",
            state: "State",
            pincode: "110001"
        });
    });

    it("should place an order and atomically clear the customer cart", async () => {
        // Add item to cart first
        await Cart.create({
            user: customerUser._id,
            items: [{ food: foodItem._id, quantity: 2 }]
        });

        const res = await request(app)
            .post("/api/orders")
            .set("Cookie", [`accessToken=${customerToken}`])
            .send({ addressId: address._id });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.totalAmount).toBe(250 * 2 + 40 + Math.round(500 * 0.05));

        // Check cart is now empty
        const updatedCart = await Cart.findOne({ user: customerUser._id });
        expect(updatedCart.items.length).toBe(0);

        // Check order was recorded
        const orders = await Order.find({ user: customerUser._id });
        expect(orders.length).toBe(1);
    });
});
