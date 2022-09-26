const { check } = require("express-validator");
const validatorError = require("../../middleware/validatorError");
const slugifyTitle = require("../slugify");

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name field is required")
    .isLength({ max: 200 })
    .withMessage("Category name is too long")
    .isLength({ min: 3 })
    .withMessage("Category name is too short")
    .custom(slugifyTitle),
  check("image").notEmpty().withMessage("Category image is required"),
  validatorError,
];
const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorError,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorError,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id"),
  validatorError,
];

module.exports = {
  updateCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
};
