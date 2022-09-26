const { check } = require("express-validator");
const slugifyTitle = require("../slugify");
const validatorError = require("../../middleware/validatorError");
const Author = require("../../models/Author");
const Category = require("../../models/Category");

const createBookValidator = [
  check("title")
    .notEmpty()
    .withMessage("Title field is required")
    .isLength({ max: 200 })
    .withMessage("Book name is too long")
    .isLength({ min: 3 })
    .withMessage("Book name is too short")
    .custom(slugifyTitle),
  check("description")
    .notEmpty()
    .withMessage("Title field is required")
    .isLength({ max: 500 })
    .withMessage("Book description is too long")
    .isLength({ min: 3 })
    .withMessage("Book description is too short"),
  check("quantity")
    .notEmpty()
    .withMessage("Book quantity is required")
    .isNumeric()
    .withMessage("Book quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Book quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Price field is required")
    .isNumeric()
    .withMessage("Price must be a Number")
    .isLength({ max: 30 }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Book priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("coverImage").notEmpty().withMessage("Book coverImage is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  check("author").custom((val, { req }) =>
    Author.findById(val).then((author) => {
      if (!author) {
        return Promise.reject(new Error("Author is not found"));
      }
    })
  ),
  check("category").custom((val, { req }) =>
    Category.findById(val).then((category) => {
      if (!category) {
        return Promise.reject(new Error("category is not found"));
      }
    })
  ),
  validatorError,
];

const getBookValidator = [
  check("id").isMongoId().withMessage("Invalid Book id"),
  validatorError,
];

const updateBookValidator = [
  check("id").isMongoId().withMessage("Invalid Book id"),
  validatorError,
];

const deleteBookValidator = [
  check("id").isMongoId().withMessage("Invalid Book id"),
  validatorError,
];

module.exports = {
  updateBookValidator,
  createBookValidator,
  deleteBookValidator,
  getBookValidator,
};
