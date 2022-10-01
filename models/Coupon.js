const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Coupon name is required"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", CouponSchema);
