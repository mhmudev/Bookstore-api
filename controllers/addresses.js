const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const APIError = require("../utils/APIError");
const jwt = require("jsonwebtoken");

const addAddress = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  if (!user) {
    return new APIError("You have to login first", 403);
  }
  const userAddresses = await User.findByIdAndUpdate(
    user.userId,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    msg: "Address added successfully to your addresses",
    data: userAddresses.addresses,
  });
});

const removeAddress = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  if (!user) {
    return new APIError("You have to login first", 403);
  }
  const userAddresses = await User.findByIdAndUpdate(
    user.userId,
    {
      $pull: { addresses: req.params },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    msg: "Address removed successfully to your addresses",
    data: userAddresses.addresses,
  });
});

const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  if (!user) {
    return new APIError("You have to login first", 403);
  }
  const userAddresses = await User.findById(user.userId)
    .select("addresses -_id")
    .populate("addresses");
  res.status(200).json({
    status: "Success",
    data: userAddresses,
  });
});

module.exports = {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
};
