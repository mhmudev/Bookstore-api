const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Book = require("./Book");

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

ReviewSchema.statics.avgAndQuantityRatings = async function (bookId) {
  const result = await this.aggregate([
    {
      $match: { book: bookId },
    },
    {
      $group: {
        _id: "book",
        avgRating: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingsAverage: result[0].avgRating,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.avgAndQuantityRatings(this.book);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.avgAndQuantityRatings(this.book);
});

module.exports = mongoose.model("Review", ReviewSchema);
