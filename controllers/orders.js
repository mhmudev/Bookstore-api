const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");
const APIError = require("../utils/APIError");
const Order = require("../models/Order");
const User = require("../models/User");
const Book = require("../models/Book");

const createOrder = asyncHandler(async (req, res, next) => {
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  const cart = await Cart.findOne({ user: verifyUser.userId });
  const user = await User.findById(verifyUser.userId);
  const addressIndex = user.addresses.findIndex(
    (address) => address.alias === "Home"
  );
  if (!cart) {
    return next(new APIError("No cart for this user", 404));
  }
  const totalPrice = cart.priceAfterDiscount
    ? cart.priceAfterDiscount
    : cart.totalCartPrice;

  const order = await Order.create({
    user: verifyUser.userId,
    cartItems: cart.cartItems,
    totalOrderPrice: totalPrice,
    shippingAddress: user.addresses[addressIndex],
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.book },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Book.bulkWrite(bulkOption, {});
    await Cart.findOneAndDelete({ user: verifyUser.userId });
  }
  res.status(200).json({ data: order });
});

module.exports = { createOrder };
