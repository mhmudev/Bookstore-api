const fs = require("fs/promises");
const path = require("path");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const APIError = require("../utils/APIError");
const APIFeatures = require("../utils/APIFeatures");
const bcrypt = require("bcryptjs");

const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });
  res.status(201).json(user);
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { name, phone, email, image, role, slug } = req.body;

  const userId = req.params.id;
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { name, phone, email, image, role, slug },
    { new: true }
  );

  res.status(200).json(user);
});

const updateUserPassword = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { password: await bcrypt.hash(req.body.password, 12) },
    { new: true }
  );
  const token = user.createToken({ userId: user._id });
  // res.cookie("token", token, { httpOnly: true });
  req.session.token = token;
  res.status(200).json(user);
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete({ _id: userId });
  await fs.unlink(path.join(__dirname, `../uploads/users/${user.image}`));
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

  const { mongooseQuery, paginationResult } = apiFeat;

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

const getLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  req.params.id = user.userId;
  next();
});

const changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = jwt.verify(req.session.token, process.env.JWT_SECRET);
  req.params.id = user.userId;
  next();
});

const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const verifiedUser = jwt.verify(req.session.token, process.env.JWT_SECRET);
  const { name, phone, email, slug } = req.body;

  const userId = verifiedUser.userId;
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { name, phone, email, slug },
    { new: true }
  );

  res.status(200).json(user);
});

const deactivateLoggedUserData = asyncHandler(async (req, res, next) => {
  const verifiedUser = jwt.verify(req.session.token, process.env.JWT_SECRET);

  const userId = verifiedUser.userId;
  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { active: false },
    { new: true }
  );

  res.status(200).json({ user, msg: "User deactivated" });
});

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  updateUserPassword,
  getLoggedUserData,
  changeLoggedUserPassword,
  updateLoggedUserData,
  deactivateLoggedUserData,
};
