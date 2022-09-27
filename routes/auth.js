const express = require("express");
const { signup, login } = require("../controllers/auth");
const { upload, resizeImage } = require("../utils/multerHandler");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

// router
//   .route("/updatePassword/:id")
//   .put(updateUserPasswordValidator, updateUserPassword);

// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .put(updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);
router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);

module.exports = router;
