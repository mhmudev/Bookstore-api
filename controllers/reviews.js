const asyncHandler = require("../middleware/asyncHandler");
const Review = require("../models/Review");
const APIError = require("../utils/APIError");
const APIFeatures = require("../utils/APIFeatures");

const createReview = asyncHandler(async (req, res, next) => {
  const review = await Review.create({ ...req.body });
  res.status(201).json(review);
});

const updateReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findByIdAndUpdate(
    { _id: reviewId },
    { ...req.body }
  );
  res.status(200).json(review);
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findByIdAndDelete({ _id: reviewId });
  res.status(200).json(review);
});

const getReviews = asyncHandler(async (req, res, next) => {
  const numOfDocs = await Review.countDocuments();
  const apiFeatures = new APIFeatures(req.query, Review.find());
  apiFeatures
    .fields()
    .filter()
    .search("Review")
    .sort()
    .getAuthorBooks(req.params.id)
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
};
