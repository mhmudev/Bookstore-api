const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const APIError = require("../utils/APIError");
const jwt = require("jsonwebtoken");

const addBookToWishlist = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  if (!user) {
    return new APIError("You have to login first", 403);
  }
  const userWishlist = await User.findByIdAndUpdate(
    user.userId,
    {
      $addToSet: { wishlist: req.body.bookId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    msg: "Product added successfully to your wishlist",
    data: userWishlist.wishlist,
  });
});

const removeBookFromWishlist = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  if (!user) {
    return new APIError("You have to login first", 403);
  }
  const userWishlist = await User.findByIdAndUpdate(
    user.userId,
    {
      $pull: { wishlist: req.params.bookId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    msg: "Product removed successfully to your wishlist",
    data: userWishlist.wishlist,
  });
});

const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  if (!user) {
    return new APIError("You have to login first", 403);
  }
  const userWishlist = await User.findById(user.userId)
    .select("wishlist -_id")
    .populate("wishlist");
  res.status(200).json({
    status: "Success",
    data: userWishlist,
  });
});

module.exports = {
  addBookToWishlist,
  removeBookFromWishlist,
  getLoggedUserWishlist,
};
