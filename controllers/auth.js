const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const APIError = require("../utils/APIError");
const jwt = require("jsonwebtoken");

const signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  const token = user.createToken({ userId: user._id });
  res.cookie("token", token, { httpOnly: true });

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
  res.cookie("token", token, { httpOnly: true });
  res.status(200).json({ user, token });
});

const protect = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (req.cookies.token) {
      const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      console.log(payload.userId);
      const user = await User.findOne({ _id: payload.userId });
      if (user) {
        if (!roles.includes(user.role)) {
          return next(
            new APIError("You're not allowed to access this route", 403)
          );
        }
        return next();
      } else {
        return next(
          new APIError("You're not allowed to access this route", 401)
        );
      }
    } else {
      return next(new APIError("You're not allowed to access this route", 401));
    }
  });
module.exports = { signup, login, protect };
