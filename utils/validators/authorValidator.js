const { check } = require("express-validator");
const validatorError = require("../../middleware/validatorError");
const slugifyTitle = require("../slugify");

const createAuthorValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name field is required")
    .isLength({ max: 200 })
    .withMessage("Author name is too long")
    .isLength({ min: 3 })
    .withMessage("Author name is too short")
    .custom(slugifyTitle),
  validatorError,
];
const getAuthorValidator = [
  check("id").isMongoId().withMessage("Invalid Author id"),
  validatorError,
];

const updateAuthorValidator = [
  check("id").isMongoId().withMessage("Invalid Author id"),
  validatorError,
];

const deleteAuthorValidator = [
  check("id").isMongoId().withMessage("Invalid Author id"),
  validatorError,
];

module.exports = {
  updateAuthorValidator,
  createAuthorValidator,
  deleteAuthorValidator,
  getAuthorValidator,
};
