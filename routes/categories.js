const express = require("express");
const {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require("../controllers/categories");
const { upload, resizeImage } = require("../utils/multerHandler");

const {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
} = require("../utils/validators/categoryValidator");

const router = express.Router();

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
router
  .route("/")
  .get(getCategories)
  .post(
    upload.single("image"),
    resizeImage("uploads/categories", "category"),
    createCategoryValidator,
    createCategory
  );

module.exports = router;
