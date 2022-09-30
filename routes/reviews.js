const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
} = require("../controllers/reviews");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const { protect } = require("../controllers/auth");

const router = express.Router();

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(updateReviewValidator, protect("admin", "user"), updateReview)
  .delete(deleteReviewValidator, protect("admin", "user"), deleteReview);

router
  .route("/")
  .get(getReviews)
  .post(protect("admin", "user"), createReviewValidator, createReview);

module.exports = router;
