const jwt = require("jsonwebtoken");
const User = require("../models/User");
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
  await cart.save();
  res.status(200).json({ status: "Success", data: cart });
});

const getUserCart = asyncHandler(async (req, res, next) => {
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  let cart = await Cart.findOne({ user: verifyUser.userId });
  if (!cart) {
    return new APIError("No cart for this user", 404);
  }
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
  await cart.save();
  res.status(200).json({ cartLength: cart.cartItems.length, data: cart });
});

module.exports = { addToCart, getUserCart, removeCartItem };
