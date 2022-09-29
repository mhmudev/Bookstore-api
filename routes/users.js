const express = require("express");
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  updateUserPassword,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUserData,
  logOutLoggedUser,
} = require("../controllers/users");
const { upload, resizeImage } = require("../utils/multerHandler");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateUserPasswordValidator,
} = require("../utils/validators/userValidator");
const { protect } = require("../controllers/auth");

const router = express.Router();

router.get("/profile", protect("user", "admin"), getLoggedUserData, getUser);
router.get("/logout", protect("user", "admin"), logOutLoggedUser);

router.delete(
  "/deactivate",
  protect("user", "admin"),
  deactivateLoggedUserData
);

router.put(
  "/changePassword",
  protect("user", "admin"),
  changeLoggedUserPassword,
  updateUserPasswordValidator,
  updateUserPassword
);
router.put("/updateProfile", protect("user", "admin"), updateLoggedUserData);

// Admin
router
  .route("/updatePassword/:id")
  .put(protect("admin"), updateUserPasswordValidator, updateUserPassword);

router
  .route("/:id")
  .get(protect("admin"), getUserValidator, getUser)
  .put(protect("admin"), updateUserValidator, updateUser)
  .delete(protect("admin"), deleteUserValidator, deleteUser);
router
  .route("/")
  .get(protect("admin"), getUsers)
  .post(
    protect("admin"),
    upload.single("image"),
    resizeImage("uploads/users", "user"),
    createUserValidator,
    createUser
  );

module.exports = router;
