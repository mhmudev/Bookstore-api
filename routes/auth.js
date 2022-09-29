const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
  logout,
} = require("../controllers/auth");
const { upload, resizeImage } = require("../utils/multerHandler");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/verifyResetCode").post(verifyResetCode);
router.route("/resetPassword").put(resetPassword);
router.route("/logout").get(logout);

module.exports = router;
