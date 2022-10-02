const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        book: {
          type: mongoose.Types.ObjectId,
          ref: "Book",
        },
        price: Number,
        color: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalCartPrice: Number,
    priceAfterDiscount: Number,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
