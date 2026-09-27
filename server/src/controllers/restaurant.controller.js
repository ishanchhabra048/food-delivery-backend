const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Restaurant = require("../models/restaurant.model");
const { clearRestaurantCache, getCache, setCache } = require("../utils/cache");

const createRestaurant = asyncHandler(async (req, res) => {
    const { name, description, address, isOpen } = req.body;

    if (!name || !address) {
        throw new ApiError(400, "Restaurant name and address are required");
    }

    const restaurant = await Restaurant.create({
        name,
        description,
        address,
        owner: req.user._id,
        isOpen: isOpen !== undefined ? isOpen : true
    });

    if (!restaurant) {
        throw new ApiError(500, "Something went wrong while creating the restaurant");
    }

    await clearRestaurantCache();

    return res.status(201).json(
        new ApiResponse(201, "Restaurant created successfully", restaurant)
    );
});

const { getPagination, getSort } = require("../utils/paginate");

const getAllRestaurants = asyncHandler(async (req, res) => {
    const { page, limit, search, isOpen, sortBy, sortOrder } = req.query;

    // 1. Create unique cache key
    const cacheKey = `restaurants:${JSON.stringify(req.query)}`;

    // 2. Check Redis cache
    const cachedRestaurants = await getCache(cacheKey);

    if (cachedRestaurants) {
        return res.status(200).json(
            new ApiResponse(
                200,
                "Restaurants fetched from cache",
                cachedRestaurants
            )
        );
    }

    // 3. Pagination & Sorting setup
    const { skip, buildPaginationResponse } = getPagination({ page, limit });
    const sort = getSort(
        { sortBy, sortOrder },
        ["name", "createdAt"],
        { createdAt: -1 }
    );

    // 4. Build Filter object
    const filter = {};

    // Search by restaurant name (case-insensitive)
    if (search) {
        filter.name = { $regex: search, $options: "i" };
    }

    // Filter by open/closed status
    if (isOpen !== undefined) {
        filter.isOpen = isOpen === "true";
    }

    // 5. Query Database
    const [totalDocs, restaurants] = await Promise.all([
        Restaurant.countDocuments(filter),
        Restaurant.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit) || 10)
    ]);

    // 6. Prepare response data
    const responseData = {
        restaurants,
        pagination: buildPaginationResponse(totalDocs)
    };

    // 7. Store response in Redis
    await setCache(cacheKey, responseData, 300);

    // 8. Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Restaurants fetched successfully",
            responseData
        )
    );
});

const getRestaurantById = asyncHandler(async(req,res)=>{
   const {id} = req.params;
   const restaurant = await Restaurant.findById(id);
   if(!restaurant){
    throw new ApiError(404,"Restaurant not found")
   }
   return res.status(200).json(
    new ApiResponse(200, "Restaurant fetched successfully", restaurant)
   )
});

const updateRestaurant = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  const {name,description,address,isOpen} = req.body;
  
  const restaurant = await Restaurant.findById(id);
  if(!restaurant){
    throw new ApiError(404,"Restaurant not found")
  }

  if(restaurant.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403,"You are not authorized to update this restaurant");
  }



  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    id,
    {
      $set:{
        name,
        description,
        address,
        isOpen
      }
    },
    {
      new:true
    }
  );

  await clearRestaurantCache();

  return res.status(200).json(
    new ApiResponse(200, "Restaurant updated successfully", updatedRestaurant)
  );
});

const deleteRestaurant = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete this restaurant"
        );
    }

    await Restaurant.findByIdAndDelete(id);

    await clearRestaurantCache();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Restaurant deleted successfully",
            {}
        )
    );
});

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    clearRestaurantCache
};
