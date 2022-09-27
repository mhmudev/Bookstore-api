const asyncHandler = require("../middleware/asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const APIError = require("../utils/APIError");

const signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  const token = user.createToken({ userId: user._id });

  res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  // const checkPassword = await user.isValidPassword(req.body.password);

  // console.log(checkPassword);
  if (!user || !(await user.isValidPassword(req.body.password))) {
    return next(new APIError("Invalid credentials", 401));
  }

  const token = user.createToken({ userId: user._id });
  res.status(200).json({ user, token });
});

module.exports = { signup, login };
