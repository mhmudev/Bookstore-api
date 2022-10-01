const asyncHandler = require("../middleware/asyncHandler");
const Coupon = require("../models/Coupon");
const APIError = require("../utils/APIError");

const createCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

const updateCoupon = asyncHandler(async (req, res, next) => {
  const couponId = req.params.id;
  const coupon = await Coupon.findByIdAndUpdate(
    { _id: couponId },
    { ...req.body }
  );
  res.status(200).json(coupon);
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
  const couponId = req.params.id;
  const coupon = await Coupon.findByIdAndDelete({ _id: couponId });
  res.status(200).json(coupon);
});

const getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({});
  res.status(200).json(coupons);
});

const getCoupon = asyncHandler(async (req, res, next) => {
  const couponId = req.params.id;
  const coupon = await Coupon.findById({ _id: couponId });
  if (!coupon) {
    return next(new APIError(`Coupon with id doesn't exist`, 404));
  }
  res.status(200).json(coupon);
});

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
};
