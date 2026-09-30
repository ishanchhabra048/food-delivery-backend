require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");
const Food = require("../models/food.model");
const Address = require("../models/address.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/food-delivery";

const seedData = async () => {
    if (process.env.NODE_ENV === "production" && !process.argv.includes("--force")) {
        console.error("Refusing to seed in production environment without --force");
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB for seeding...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB.");

        // 1. Create or update Demo Users
        const usersToSeed = [
            {
                fullName: "Jane Customer",
                email: "customer@anyfeast.com",
                password: "Password123!",
                phoneNumber: "9876543210",
                role: "User"
            },
            {
                fullName: "Chef Luigi Owner",
                email: "owner@anyfeast.com",
                password: "Password123!",
                phoneNumber: "9876543211",
                role: "restaurantOwner"
            },
            {
                fullName: "System Admin",
                email: "admin@anyfeast.com",
                password: "Password123!",
                phoneNumber: "9876543212",
                role: "admin"
            }
        ];

        const seededUsers = {};
        for (const u of usersToSeed) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create(u);
                console.log(`Created user: ${u.email} (${u.role})`);
            } else {
                user.fullName = u.fullName;
                user.phoneNumber = u.phoneNumber;
                user.role = u.role;
                await user.save();
                console.log(`Updated user: ${u.email} (${u.role})`);
            }
            seededUsers[u.role] = user;
        }

        // 2. Create demo address for customer
        let customerAddress = await Address.findOne({ user: seededUsers.User._id });
        if (!customerAddress) {
            customerAddress = await Address.create({
                user: seededUsers.User._id,
                fullName: "Jane Customer",
                phoneNumber: "9876543210",
                addressLine: "42 Gourmet Boulevard, Apt 4B",
                city: "Metropolis",
                state: "State",
                pincode: "110001",
                isDefault: true
            });
            console.log("Created customer default address.");
        }

        const ownerId = seededUsers.restaurantOwner._id;

        // 3. Demo Restaurants
        const restaurantsToSeed = [
            {
                name: "Bella Italia Trattoria",
                description: "Authentic wood-fired Neapolitan pizzas, handcrafted pasta, and Tuscan wines.",
                cuisine: "Italian",
                address: "12 Olive Garden Lane, Little Italy",
                isOpen: true,
                image: {
                    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                    publicId: ""
                },
                owner: ownerId,
                foods: [
                    {
                        name: "Margherita Pizza D.O.P.",
                        description: "San Marzano tomatoes, buffalo mozzarella, fresh basil, and extra virgin olive oil.",
                        price: 349,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Truffle Tagliatelle",
                        description: "Fresh egg pasta tossed with black summer truffle cream, parmesan, and wild mushrooms.",
                        price: 429,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1621996346565-e3d5d628169b?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Crispy Bruschetta Trio",
                        description: "Grilled sourdough topped with heirloom tomatoes, garlic, basil, and aged balsamic glaze.",
                        price: 219,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Classic Tiramisu",
                        description: "Espresso-soaked ladyfingers layered with rich mascarpone zabaglione and cocoa powder.",
                        price: 189,
                        category: "Desserts",
                        image: { url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Italian Blood Orange Soda",
                        description: "Sparkling artisan soda made with Sicilian blood oranges.",
                        price: 119,
                        category: "Drinks",
                        image: { url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Arancini al Tartufo",
                        description: "Crispy golden risotto balls stuffed with smoked provolone and served with marinara dip.",
                        price: 249,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    }
                ]
            },
            {
                name: "Royal Spice Mahal",
                description: "Fragrant slow-cooked biryanis, velvety curries, and sizzling tandoori delicacies.",
                cuisine: "Indian",
                address: "88 Saffron Way, Spice District",
                isOpen: true,
                image: {
                    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                    publicId: ""
                },
                owner: ownerId,
                foods: [
                    {
                        name: "Dum Gosht Biryani",
                        description: "Slow-cooked fragrant basmati rice with tender spiced mutton, saffron, and caramelized onions.",
                        price: 399,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Butter Chicken Supreme",
                        description: "Charcoal-smoked chicken tikka simmered in a velvety tomato, cashew, and fenugreek butter gravy.",
                        price: 359,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Paneer Tikka Angara",
                        description: "Char-grilled cottage cheese cubes marinated in Kashmiri red chili, yogurt, and spices.",
                        price: 269,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Shahi Tukda with Rabri",
                        description: "Crispy ghee-fried bread soaked in saffron cardamom syrup topped with thickened malai milk.",
                        price: 159,
                        category: "Desserts",
                        image: { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Mango Kesar Lassi",
                        description: "Thick chilled yogurt beverage blended with sweet Alphonso mango pulp and saffron threads.",
                        price: 129,
                        category: "Drinks",
                        image: { url: "https://images.unsplash.com/photo-1571006682879-115f02c63dfb?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Amritsari Kulcha Platter",
                        description: "Flaky potato-and-paneer stuffed flatbread served with spicy chickpea curry and tangy chutney.",
                        price: 229,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    }
                ]
            },
            {
                name: "Tokyo Ramen & Izakaya",
                description: "Rich 18-hour simmered Tonkotsu broth, handmade ramen noodles, crispy gyoza, and matcha treats.",
                cuisine: "Japanese",
                address: "45 Sakura Avenue, Downtown",
                isOpen: true,
                image: {
                    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
                    publicId: ""
                },
                owner: ownerId,
                foods: [
                    {
                        name: "Black Garlic Tonkotsu Ramen",
                        description: "Rich pork bone broth, thin handmade ramen, chashu pork belly, ajitsuke tamago, and charred black garlic oil.",
                        price: 379,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Salmon Aburi Sushi Roll",
                        description: "Flame-seared fresh Atlantic salmon over seasoned sushi rice with spicy mayo and tobiko.",
                        price: 419,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Pan-Seared Pork Gyoza",
                        description: "Crispy pan-fried dumplings filled with minced Berkshire pork, cabbage, scallions, and ginger dip.",
                        price: 239,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Matcha Lava Cake",
                        description: "Warm ceremonial Japanese green tea molten cake with vanilla bean gelato.",
                        price: 199,
                        category: "Desserts",
                        image: { url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Iced Yuzu Green Tea",
                        description: "Refreshing cold-brewed Sencha infused with fragrant Japanese citrus yuzu honey.",
                        price: 129,
                        category: "Drinks",
                        image: { url: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Edamame with Sea Salt",
                        description: "Steamed whole soybeans sprinkled with flaky Maldon sea salt and smoked sesame.",
                        price: 169,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    }
                ]
            },
            {
                name: "The Craft Burger Co.",
                description: "Smash burgers made with prime aged beef, brioche buns, golden seasoned waffle fries, and thick shakes.",
                cuisine: "Burgers",
                address: "704 Broadway Blvd, Uptown",
                isOpen: true,
                image: {
                    url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80",
                    publicId: ""
                },
                owner: ownerId,
                foods: [
                    {
                        name: "Smokey Truffle Double Smash",
                        description: "Two crispy smashed beef patties, double aged cheddar, caramelized shallots, bacon jam, and truffle aioli.",
                        price: 329,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Crispy Nashville Hot Chicken",
                        description: "Buttermilk-brined crispy chicken thigh tossed in fiery Nashville chili oil, dill pickles, and creamy coleslaw.",
                        price: 299,
                        category: "Mains",
                        image: { url: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Loaded Truffle Parmesan Fries",
                        description: "Crispy skin-on fries tossed in white truffle oil, grated parmesan, fresh parsley, and garlic ranch dip.",
                        price: 199,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Salted Caramel Pretzel Shake",
                        description: "Hand-spun vanilla custard milkshake blended with salted caramel ribbons and crushed pretzel crust.",
                        price: 169,
                        category: "Drinks",
                        image: { url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Warm Chocolate Fudge Brownie",
                        description: "Gooey double-fudge brownie topped with toasted walnuts, hot chocolate fudge, and vanilla cream.",
                        price: 179,
                        category: "Desserts",
                        image: { url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    },
                    {
                        name: "Crispy Onion Petals",
                        description: "Beer-battered onion petals served with zesty horseradish remoulade.",
                        price: 159,
                        category: "Starters",
                        image: { url: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80", publicId: "" }
                    }
                ]
            }
        ];

        for (const restData of restaurantsToSeed) {
            const { foods, ...restFields } = restData;
            let restaurant = await Restaurant.findOne({ name: restFields.name });
            if (!restaurant) {
                restaurant = await Restaurant.create(restFields);
                console.log(`Created restaurant: ${restaurant.name}`);
            } else {
                restaurant.description = restFields.description;
                restaurant.cuisine = restFields.cuisine;
                restaurant.address = restFields.address;
                restaurant.image = restFields.image;
                restaurant.isOpen = restFields.isOpen;
                await restaurant.save();
                console.log(`Updated restaurant: ${restaurant.name}`);
            }

            for (const foodItem of foods) {
                let food = await Food.findOne({ name: foodItem.name, restaurant: restaurant._id });
                if (!food) {
                    food = await Food.create({
                        ...foodItem,
                        restaurant: restaurant._id,
                        isAvailable: true
                    });
                    console.log(`  - Created food: ${food.name} (Rs. ${food.price})`);
                } else {
                    food.price = foodItem.price;
                    food.description = foodItem.description;
                    food.category = foodItem.category;
                    food.image = foodItem.image;
                    food.isAvailable = true;
                    await food.save();
                    console.log(`  - Updated food: ${food.name}`);
                }
            }
        }

        console.log("\n=======================================================");
        console.log("             SEEDING COMPLETED SUCCESSFULLY             ");
        console.log("=======================================================");
        console.log("Demo Credentials:");
        console.log("  Customer:         customer@anyfeast.com  | Password: Password123!");
        console.log("  Restaurant Owner: owner@anyfeast.com     | Password: Password123!");
        console.log("  Administrator:    admin@anyfeast.com     | Password: Password123!");
        console.log("=======================================================\n");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();
