const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Rating minimum value is 1.0"],
      max: [5, "Rating maximum value is 5.0"],
      required: [true, "Review rating is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Review user is required"],
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
      required: [true, "Review book is required"],
    },
  },
  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

module.exports = mongoose.model("Review", ReviewSchema);
