const { check } = require("express-validator");
const validatorError = require("../../middleware/validatorError");
const User = require("../../models/User");
const slugifyTitle = require("../slugify");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name field is required")
    .isLength({ max: 200 })
    .withMessage("User name is too long")
    .isLength({ min: 3 })
    .withMessage("User name is too short")
    .custom(slugifyTitle),
  check("email")
    .notEmpty()
    .withMessage("Email field is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  check("password")
    .notEmpty()
    .withMessage("Password field is required")
    .isLength({ min: 6 })
    .withMessage("Password length is too short")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm field is required"),
  check("phone")
    .isMobilePhone("ar-EG")
    .withMessage("Please provide a vaild phone number"),

  validatorError,
];
const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id"),
  validatorError,
];

const updateUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User id")
    .custom((val, { req }) => (req.body.slug = slugify(req.body.name))),
  check("phone")
    .isMobilePhone("ar-EG")
    .withMessage("Please provide a vaild phone number"),
  check("email")
    .notEmpty()
    .withMessage("Email field is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  validatorError,
];

const updateUserPasswordValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid User id")
    .custom(async (val, { req }) => {
      const user = await User.findById(val);
      if (!user) {
        throw new Error(`no user with id ${val}`);
      }
      const comparePassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!comparePassword) {
        throw new Error("Current password is wrong");
      }
      return true;
    })
    .custom((val, { req }) => {
      if (req.body.password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm field is required"),
  validatorError,
];

const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id"),
  validatorError,
];

module.exports = {
  updateUserValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserPasswordValidator,
};
