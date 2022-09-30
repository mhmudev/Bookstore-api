const { check } = require("express-validator");
const slugifyTitle = require("../slugify");
const validatorError = require("../../middleware/validatorError");
const Review = require("../../models/Review");
const jwt = require("jsonwebtoken");

const createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Review field is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review must be between 1 and 5"),
  check("book")
    .isMongoId()
    .withMessage("Invalid book id")
    .custom(async (val, { req }) => {
      const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
      req.body.user = user.userId;
      const review = await Review.findOne({ book: val, user: req.body.user });
      if (review) {
        throw new Error("You already have reviewed this book");
      }
      return true;
    }),
  validatorError,
];

const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id"),
  validatorError,
];

const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id")
    .custom(async (val, { req }) => {
      const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
      const review = await Review.findOne({ _id: val, user: user.userId });
      if (!review) {
        throw new Error("You can't update this review");
      }
      return true;
    }),
  validatorError,
];

const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id")
    .custom(async (val, { req }) => {
      const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
      if (user.role === "user") {
        const review = await Review.findOne({ _id: val, user: user.userId });
        if (!review) {
          throw new Error("You can't update this review");
        }
      }
      return true;
    }),
  validatorError,
];

module.exports = {
  updateReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
  getReviewValidator,
};
