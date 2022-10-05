const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");
const APIError = require("../utils/APIError");
const Order = require("../models/Order");
const User = require("../models/User");
const Book = require("../models/Book");
const APIFeatures = require("../utils/APIFeatures");

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

const getOrders = asyncHandler(async (req, res, next) => {
  const verifyUser = jwt.verify(req.session.token, process.env.JWT_SECRET);

  const numOfDocs = await Order.countDocuments();
  const apiFeatures = new APIFeatures(
    req.query,
    Order.find({ user: verifyUser.userId })
  );
  apiFeatures.fields().filter().search("Order").sort().paginate(numOfDocs);

  const { mongooseQuery, paginationResult } = apiFeatures;

  const orders = await mongooseQuery;
  res.status(200).json({ paginationResult, length: orders.length, orders });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const orderId = req.params.id;
  const order = await Order.findById({ _id: orderId });
  if (!order) {
    return next(new APIError(`Order with id doesn't exist`, 404));
  }
  res.status(200).json(order);
});

const updateOrderPayStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById({ _id: req.params.id });
  if (!order) {
    return next(
      new APIError(`Order with id ${req.params.id} doesn't exist`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

const updateOrderDeliverStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById({ _id: req.params.id });
  if (!order) {
    return next(
      new APIError(`Order with id ${req.params.id} doesn't exist`, 404)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderPayStatus,
  updateOrderDeliverStatus,
};
