const asyncHandler = require("../middleware/asyncHandler");
const Review = require("../models/Review");
const APIError = require("../utils/APIError");
const APIFeatures = require("../utils/APIFeatures");

const setBookIdToBody = (req, res, next) => {
  if (req.params.id) {
    req.body.book = req.params.id;
  }
  next();
};
const createReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create({ ...req.body });
  res.status(201).json(review);
});

const updateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findByIdAndUpdate(
    { _id: reviewId },
    { ...req.body },
    { new: true }
  );
  // trigger save event when update to update ratings average
  review.save();
  res.status(200).json(review);
});

const deleteReview = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  const reviewId = req.params.id;
  const review = await Review.findByIdAndDelete({ _id: reviewId });
  // trigger remove event when update to update ratings average
  review.remove();
  res.status(200).json(review);
});

const getReviews = asyncHandler(async (req, res, next) => {
  const apiFeatures = new APIFeatures(req.query, Review.find());
  const numOfDocs = await Review.countDocuments();

  const a = apiFeatures
    .fields()
    .filter()
    .search("Review")
    .sort()
    .getNestedRouteThing(req.params.id ? { book: req.params.id } : {})
    .paginate(numOfDocs);

  const { mongooseQuery, paginationResult } = apiFeatures;

  const reviews = await mongooseQuery;

  res.status(200).json({ paginationResult, length: reviews.length, reviews });
});

const getReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;

  const review = await Review.findById({ _id: reviewId });
  if (!review) {
    return next(new APIError(`Review with id doesn't exist`, 404));
  }
  res.status(200).json(review);
});

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
  setBookIdToBody,
};
