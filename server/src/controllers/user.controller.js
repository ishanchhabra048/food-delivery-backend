const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
});

const registerUser = asyncHandler(async(req,res)=>{
  const {fullName, name, email, password, phoneNumber, role} = req.body;
  const actualFullName = fullName || name;

  if(!actualFullName || !email || !password || !phoneNumber){
    throw new ApiError(400, "All fields are required");
  }
  const exsisitingUser = await User.findOne({email});
  if(exsisitingUser){
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    fullName: actualFullName,
    email,
    password,
    phoneNumber,
    role: role || "User"
  });

  const createdUser = await User
  .findById(user._id)
  .select("-password");

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while creating user");
  }

  return res.status(201).json(new ApiResponse(201, "User registered successfully", createdUser));
})

const loginUser = asyncHandler(async(req,res)=>{
  const {email, password} = req.body;
  if(!email ||!password){
    throw new ApiError(400,"Email and password is required")
  }
  const user = await User.findOne({email})
  if(!user){
    throw new ApiError(404,"User not found")
  }
  const isPasswordValid = await user.comparePassword(password);
  if(!isPasswordValid){
    throw new ApiError(401,"Invalid password")
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");


  const options = getCookieOptions();

  return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
          new ApiResponse(
              200,
              "User logged in successfully",
              {
                  user: loggedInUser,
                  accessToken,
                  refreshToken
              }
          )
      );
});


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken:1
      }
    },
    {
      new:true
    }
  );
  const options = getCookieOptions();
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(
      200,
      "User logged out successfully"
    )
  );
});

//If the access token expires, the user shouldn't have to log in again.
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    let user;

    try {

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

    } catch (error) {

        throw new ApiError(
            401,
            "Invalid or expired refresh token"
        );
    }

    // 1. Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // 2. Save new refresh token
    user.refreshToken = newRefreshToken;

    await user.save({
        validateBeforeSave: false
    });

    // 3. Send new tokens through cookies
    const options = getCookieOptions();

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                "Access token refreshed successfully",
                {}
            )
        );
});



const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            "Current user fetched successfully",
            req.user
        )
    );
});

const changePassword = asyncHandler(async (req, res) => {

    // 1. Get passwords from request
    const { currentPassword, newPassword } = req.body;

    // 2. Validate
    if (!currentPassword || !newPassword) {
        throw new ApiError(
            400,
            "Current password and new password are required"
        );
    }

    // 3. Find logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 4. Check current password
    const isPasswordCorrect =
        await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // 5. Set new password
    user.password = newPassword;

    // 6. Save
    // Your pre-save bcrypt middleware will hash the new password
    await user.save();

    // 7. Response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Password changed successfully",
            {}
        )
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const fullName = req.body.fullName || req.body.name;
    const { email, phoneNumber } = req.body;

    if (!fullName || !email || !phoneNumber) {
        throw new ApiError(
            400,
            "Full name, email and phone number are required"
        );
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName,
                email,
                phoneNumber
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "Account details updated successfully",
            user
        )
    );
});

const { getPagination, getSort } = require("../utils/paginate");

const getAllUsers = asyncHandler(async (req, res) => {
    const { page, limit, role, search, sortBy, sortOrder } = req.query;

    // 1. Pagination & Sorting setup
    const { skip, buildPaginationResponse } = getPagination({ page, limit });
    const sort = getSort(
        { sortBy, sortOrder },
        ["fullName", "email", "createdAt"],
        { createdAt: -1 }
    );

    // 2. Build Filter object
    const filter = {};

    // Filter by specific role (e.g. User, restaurantOwner, admin)
    if (role) {
        filter.role = role;
    }

    // Search across name, email, or phone number (case-insensitive)
    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phoneNumber: { $regex: search, $options: "i" } }
        ];
    }

    // 3. Query Database
    const [totalDocs, users] = await Promise.all([
        User.countDocuments(filter),
        User.find(filter)
            .select("-password -refreshToken")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit) || 10)
    ]);

    // 4. Send Response
    return res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully",
            {
                users,
                pagination: buildPaginationResponse(totalDocs)
            }
        )
    );
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessToken,
    changePassword,
    updateAccountDetails,
    getAllUsers
};
