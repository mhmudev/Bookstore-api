const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const APIError = require("../utils/APIError");
const APIFeatures = require("../utils/APIFeatures");

const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });
  res.status(201).json(user);
});

const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndUpdate({ _id: userId }, { ...req.body });
  res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete({ _id: userId });
  res.status(200).json(user);
});

const getUsers = asyncHandler(async (req, res, next) => {
  const numOfDocs = await User.countDocuments();
  const apiFeatures = new APIFeatures(req.query, User.find());
  apiFeatures
    .fields()
    .filter()
    .search()
    .sort()
    .getAuthorBooks(req.params.id)
    .paginate(numOfDocs);

  const { mongooseQuery, paginationResult } = apiFeatures;

  const users = await mongooseQuery;
  res.status(200).json({ paginationResult, length: users.length, users });
});

const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById({ _id: userId });
  if (!user) {
    return next(new APIError(`User with id doesn't exist`, 404));
  }
  res.status(200).json(user);
});

module.exports = { createUser, updateUser, deleteUser, getUser, getUsers };
