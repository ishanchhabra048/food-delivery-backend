const OwnerRequest = require("../models/ownerRequest.model");
const User = require("../models/user.model");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");  

const createOwnerRequest = asyncHandler(async (req, res) => {
  const {reason} = req.body;

  const exsistingRequest = await OwnerRequest.findOne({
    user : req.user._id
  });

  if (exsistingRequest) {
    throw new ApiError(400, "You have already submitted a request");
  }

  if (!reason) {
    throw new ApiError(400, "Reason is required");
  }

  const request = await OwnerRequest.create({
    user: req.user._id,
    reason
  });

  return res.status(201).json(
    new ApiResponse(201, "Owner request submitted successfully", request)
  );
});


const { getPagination, getSort } = require("../utils/paginate");

const getOwnerRequests = asyncHandler(async (req, res) => {
    const { page, limit, status, sortBy, sortOrder } = req.query;

    // 1. Pagination & Sorting setup
    const { skip, buildPaginationResponse } = getPagination({ page, limit });
    const sort = getSort(
        { sortBy, sortOrder },
        ["createdAt"],
        { createdAt: -1 }
    );

    // 2. Build Filter object (filter by PENDING, APPROVED, or REJECTED)
    const filter = {};
    if (status) {
        filter.status = status;
    }

    // 3. Query Database
    const [totalDocs, requests] = await Promise.all([
        OwnerRequest.countDocuments(filter),
        OwnerRequest.find(filter)
            .populate("user", "fullName email phoneNumber")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit) || 10)
    ]);

    // 4. Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Owner requests fetched successfully",
            {
                requests,
                pagination: buildPaginationResponse(totalDocs)
            }
        )
    );
});


const approveOwnerRequest = asyncHandler(async (req, res) => {
  const {id} = req.params;

  const request = await OwnerRequest.findById(id);

  if (!request) {
    throw new ApiError(404, "Owner request not found");
  }
  if (request.status !== "PENDING") {
    throw new ApiError(400, "This request has already been processed");
  }

  const user = await User.findById(request.user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.role= "restaurantOwner";
  await user.save();

  request.status = "APPROVED";
  await request.save();

  return res.status(200).json(
    new ApiResponse(200, "Owner request approved successfully", request)
  );
});


const rejectOwnerRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const request = await OwnerRequest.findById(id);

    if (!request) {
        throw new ApiError(404, "Owner request not found");
    }

    if (request.status !== "PENDING") {
        throw new ApiError(
            400,
            "This request has already been processed"
        );
    }

    request.status = "REJECTED";
    await request.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Owner request rejected successfully",
            request
        )
    );
});

const getMyOwnerRequest = asyncHandler(async (req, res) => {
    const request = await OwnerRequest.findOne({
        user: req.user._id
    }).populate("user", "fullName email");

    if (!request) {
        throw new ApiError(
            404,
            "You have not submitted an owner request"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Owner request fetched successfully",
            request
        )
    );
});


module.exports = {
  createOwnerRequest,
  getOwnerRequests,
  approveOwnerRequest,
  rejectOwnerRequest,
  getMyOwnerRequest
};  

