const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Address = require("../models/address.model");

const addressFields = [
    "fullName",
    "phoneNumber",
    "addressLine",
    "city",
    "state",
    "pincode",
    "label"
];

const requiredFields = [
    "fullName",
    "phoneNumber",
    "addressLine",
    "city",
    "state",
    "pincode"
];

const getAddressPayload = (body) => {
    const payload = {};

    addressFields.forEach((field) => {
        if (body[field] !== undefined) {
            payload[field] = body[field];
        }
    });

    return payload;
};

const addAddress = asyncHandler(async (req, res) => {
    const missingField = requiredFields.find(
        (field) => !req.body[field]
    );

    if (missingField) {
        throw new ApiError(400, `${missingField} is required`);
    }

    const payload = getAddressPayload(req.body);

    const address = await Address.create({
        ...payload,
        user: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, "Address added successfully", address)
    );
});

const getMyAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({ user: req.user._id })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, "Addresses fetched successfully", addresses)
    );
});

const getAddressById = asyncHandler(async (req, res) => {
    const address = await Address.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Address fetched successfully", address)
    );
});

const updateAddress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        fullName,
        phoneNumber,
        addressLine,
        city,
        state,
        pincode,
        label
    } = req.body;

    const address = await Address.findOne({
        _id: id,
        user: req.user._id
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    if (fullName !== undefined) address.fullName = fullName;
    if (phoneNumber !== undefined) address.phoneNumber = phoneNumber;
    if (addressLine !== undefined) address.addressLine = addressLine;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (pincode !== undefined) address.pincode = pincode;
    if (label !== undefined) address.label = label;

    await address.save();

    return res.status(200).json(
        new ApiResponse(200, "Address updated successfully", address)
    );
});

const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    });

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Address deleted successfully", address)
    );
});

module.exports = {
    addAddress,
    getMyAddresses,
    getAddressById,
    updateAddress,
    deleteAddress
};