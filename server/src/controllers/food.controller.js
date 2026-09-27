const {
    getCache,
    setCache,
    clearFoodCache
} = require("../utils/cache");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const Food = require("../models/food.model");
const Restaurant = require("../models/restaurant.model");

const { getPagination, getSort } = require("../utils/paginate");


const createFood = asyncHandler(async (req, res) => {

    // 1. Get food details
    const {
        name,
        description,
        price,
        category,
        restaurantId
    } = req.body;

    // 2. Validate
    if (!name || !price || !category || !restaurantId) {
        throw new ApiError(
            400,
            "Name, price, category and restaurantId are required"
        );
    }

    // 3. Check restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    // 4. Check restaurant ownership
    if (
        restaurant.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to add food to this restaurant"
        );
    }

    // 5. Create food
    const food = await Food.create({
        name,
        description,
        price,
        category,
        restaurant: restaurantId
    });

    // 6. Check creation
    if (!food) {
        throw new ApiError(
            500,
            "Something went wrong while creating food"
        );
    }

    await clearFoodCache();

    // 7. Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            "Food created successfully",
            food
        )
    );
});


const getAllFood = asyncHandler(async (req, res) => {

    const {
        page,
        limit,
        category,
        restaurantId,
        search,
        minPrice,
        maxPrice,
        isAvailable,
        sortBy,
        sortOrder
    } = req.query;


    // 1. Create unique cache key
    const cacheKey = `foods:${JSON.stringify(req.query)}`;


    // 2. Check Redis cache
    const cachedFoods = await getCache(cacheKey);

    if (cachedFoods) {

        return res.status(200).json(
            new ApiResponse(
                200,
                "Food fetched from cache",
                cachedFoods
            )
        );
    }


    // 3. Pagination & Sorting setup
    const {
        skip,
        buildPaginationResponse
    } = getPagination({
        page,
        limit
    });


    const sort = getSort(
        {
            sortBy,
            sortOrder
        },
        ["price", "name", "createdAt"],
        {
            createdAt: -1
        }
    );


    // 4. Build filter object
    const filter = {};


    // Search by food name
    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        };
    }


    // Filter by category
    if (category) {
        filter.category = category;
    }


    // Filter by restaurant
    if (restaurantId) {
        filter.restaurant = restaurantId;
    }


    // Filter by availability
    if (isAvailable !== undefined) {
        filter.isAvailable = isAvailable === "true";
    }


    // Filter by price range
    if (
        minPrice !== undefined ||
        maxPrice !== undefined
    ) {

        filter.price = {};

        if (minPrice !== undefined) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice !== undefined) {
            filter.price.$lte = Number(maxPrice);
        }
    }


    // 5. Get data from MongoDB
    const [totalDocs, foods] = await Promise.all([

        Food.countDocuments(filter),

        Food.find(filter)
            .populate(
                "restaurant",
                "name address"
            )
            .sort(sort)
            .skip(skip)
            .limit(Number(limit) || 10)
    ]);


    // 6. Prepare response data
    const responseData = {
        foods,
        pagination: buildPaginationResponse(totalDocs)
    };


    // 7. Store response in Redis
    await setCache(
        cacheKey,
        responseData,
        300
    );


    // 8. Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Food fetched successfully",
            responseData
        )
    );
});


const getFoodById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const food = await Food.findById(id)
        .populate(
            "restaurant",
            "name address"
        );

    if (!food) {
        throw new ApiError(
            404,
            "Food not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Food fetched successfully",
            food
        )
    );
});


const updateFood = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {
        name,
        description,
        price,
        category,
        isAvailable
    } = req.body;


    // 1. Find food
    const food = await Food.findById(id);

    if (!food) {
        throw new ApiError(
            404,
            "Food not found"
        );
    }


    // 2. Find restaurant
    const restaurant = await Restaurant.findById(
        food.restaurant
    );

    if (!restaurant) {
        throw new ApiError(
            404,
            "Restaurant not found"
        );
    }


    // 3. Check ownership
    if (
        restaurant.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to update this food"
        );
    }


    // 4. Update food
    const updatedFood =
        await Food.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    description,
                    price,
                    category,
                    isAvailable
                }
            },
            {
                new: true
            }
        );

    await clearFoodCache();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Food updated successfully",
            updatedFood
        )
    );
});


const deleteFood = asyncHandler(async (req, res) => {

    const { id } = req.params;


    // 1. Find food
    const food = await Food.findById(id);

    if (!food) {
        throw new ApiError(
            404,
            "Food not found"
        );
    }


    // 2. Find restaurant
    const restaurant = await Restaurant.findById(
        food.restaurant
    );

    if (!restaurant) {
        throw new ApiError(
            404,
            "Restaurant not found"
        );
    }


    // 3. Check ownership
    if (
        restaurant.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not allowed to delete this food"
        );
    }


    // 4. Delete food
    await Food.findByIdAndDelete(id);

    await clearFoodCache();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Food deleted successfully",
            {}
        )
    );
});


module.exports = {
    createFood,
    getAllFood,
    getFoodById,
    updateFood,
    deleteFood,
    clearFoodCache
};