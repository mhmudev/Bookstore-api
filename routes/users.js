const express = require("express");
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  updateUserPassword,
} = require("../controllers/users");
const { upload, resizeImage } = require("../utils/multerHandler");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router.route("/updatePassword/:id").put(updateUserPassword);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
router
  .route("/")
  .get(getUsers)
  .post(
    upload.single("image"),
    resizeImage("uploads/users", "user"),
    createUserValidator,
    createUser
  );

module.exports = router;
