const asyncHandler = require("../middleware/asyncHandler");
const Category = require("../models/Category");
const APIError = require("../utils/APIError");

const createCategory = asyncHandler(async (req, res, next) => {
  console.log(req.cookies.token);
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await Category.findByIdAndUpdate(
    { _id: categoryId },
    { ...req.body }
  );
  res.status(200).json(category);
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await Category.findByIdAndDelete({ _id: categoryId });
  res.status(200).json(category);
});

const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({});
  console.log(req.session.token);
  res.status(200).json(categories);
});

const getCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await Category.findById({ _id: categoryId });
  if (!category) {
    return next(new APIError(`Category with id doesn't exist`, 404));
  }
  res.status(200).json(category);
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
};
