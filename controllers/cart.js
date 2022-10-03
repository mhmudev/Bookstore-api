const jwt = require("jsonwebtoken");
const Coupon = require("../models/Coupon");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");
const APIError = require("../utils/APIError");

const addToCart = asyncHandler(async (req, res, next) => {
  const { color, bookId } = req.body;
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  const book = await Book.findById(bookId);
  let cart = await Cart.findOne({ user: verifyUser.userId });

  // If user has no cart, create one
  if (!cart) {
    cart = await Cart.create({
      user: verifyUser.userId,
      cartItems: [{ book: bookId, color, price: book.price }],
    });
  }
  // If user has cart, check if book exist with same color increase quantity by one
  else {
    const bookIndex = cart.cartItems.findIndex(
      (item) => item.book.toString() === bookId && item.color === color
    );
    if (bookIndex > -1) {
      const cartItem = cart.cartItems[bookIndex];
      cartItem.quantity += 1;
      cart.cartItems[bookIndex] = cartItem;
    } else {
      cart.cartItems.push({ book: bookId, color, price: book.price });
    }
  }

  // Calculate total price
  let totalPrice = 0;
  cart.cartItems.forEach((item) => (totalPrice += item.price * item.quantity));
  cart.totalCartPrice = totalPrice;
  cart.priceAfterDiscount = undefined;

  await cart.save();
  res.status(200).json({ status: "Success", data: cart });
});

const getUserCart = asyncHandler(async (req, res, next) => {
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  let cart = await Cart.findOne({ user: verifyUser.userId });
  if (!cart) {
    return next(new APIError("No cart for this user", 404));
  }
  cart.priceAfterDiscount = undefined;
  await cart.save();
  res.status(200).json({ cartLength: cart.cartItems.length, data: cart });
});

const removeCartItem = asyncHandler(async (req, res, next) => {
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  let cart = await Cart.findOneAndUpdate(
    { user: verifyUser.userId },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  let totalPrice = 0;
  cart.cartItems.forEach((item) => (totalPrice += item.price * item.quantity));
  cart.totalCartPrice = totalPrice;
  cart.priceAfterDiscount = undefined;
  await cart.save();
  res.status(200).json({ cartLength: cart.cartItems.length, data: cart });
});

const removeCart = asyncHandler(async (req, res, next) => {
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  await Cart.findOneAndDelete({ user: verifyUser.userId });
  res.status(404).json({ msg: "You don't have cart" });
});

const updateCartItemsQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  const cart = await Cart.findOne({ user: verifyUser.userId });
  if (!cart) {
    return next(new APIError("No cart for this user", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new APIError("Item not found", 404));
  }
  let totalPrice = 0;
  cart.cartItems.forEach((item) => (totalPrice += item.price * item.quantity));
  cart.totalCartPrice = totalPrice;
  cart.priceAfterDiscount = undefined;
  await cart.save();
  res.status(200).json({ cartLength: cart.cartItems.length, data: cart });
});

const applyCouponToCart = asyncHandler(async (req, res, next) => {
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  const cart = await Cart.findOne({ user: verifyUser.userId });
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!cart) {
    return next(new APIError("No cart for this user", 404));
  }
  if (!coupon) {
    return next(new APIError("Invalid or expired coupon", 404));
  }
  const totalPrice = cart.totalCartPrice;
  const priceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(1);
  cart.priceAfterDiscount = priceAfterDiscount;
  await cart.save();
  res.status(200).json({ cartLength: cart.cartItems.length, data: cart });
});

module.exports = {
  addToCart,
  getUserCart,
  removeCartItem,
  removeCart,
  updateCartItemsQuantity,
  applyCouponToCart,
};
