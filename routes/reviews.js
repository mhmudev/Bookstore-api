const express = require("express");
const {
  createReview,
  updateReview,
  deleteReview,
  getReview,
  getReviews,
} = require("../controllers/reviews");
// const {
//   createBookValidator,
//   getBookValidator,
//   deleteBookValidator,
//   updateBookValidator,
// } = require("../utils/validators/bookValidator");
const { protect } = require("../controllers/auth");

const router = express.Router();

router
  .route("/:id")
  .get(getReview)
  .put(protect("admin", "user"), updateReview)
  .delete(protect("admin", "user"), deleteReview);

router.route("/").get(getReviews).post(protect("admin", "user"), createReview);

module.exports = router;
