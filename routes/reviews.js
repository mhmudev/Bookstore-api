const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
  setBookIdToBody,
} = require("../controllers/reviews");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const { protect } = require("../controllers/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    protect("admin", "user"),
    setBookIdToBody,
    updateReviewValidator,
    updateReview
  )
  .delete(
    protect("admin", "user"),
    setBookIdToBody,
    deleteReviewValidator,
    deleteReview
  );

router
  .route("/")
  .get(getReviews)
  .post(
    protect("admin", "user"),
    setBookIdToBody,
    createReviewValidator,
    createReview
  );

module.exports = router;
