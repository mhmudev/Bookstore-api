const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const APIError = require("../utils/APIError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  const token = user.createToken({ userId: user._id, role: user.role });
  res.cookie("token", token, { httpOnly: true });
  req.session.token = token;
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

  const token = user.createToken({ userId: user._id, role: user.role });

  // res.cookie("token", token, { httpOnly: true });

  if (req.body.rememberMe) {
    req.session.cookie.maxAge = 604800000;
    req.session.token = token;
  } else {
    req.session.token = token;
  }

  res.status(200).json({ user, token });
});

const protect = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (req.session.token) {
      const payload = jwt.verify(req.session.token, process.env.JWT_SECRET);
      console.log(payload.userId);
      const user = await User.findOne({ _id: payload.userId });
      if (user) {
        if (!roles.includes(user.role) || !user.active) {
          return next(
            new APIError("You're not allowed to access this route", 403)
          );
        }
        return next();
      }
      return next(new APIError("You're not allowed to access this route", 401));
    }
    return next(new APIError("You're not allowed to access this route", 401));
  });

const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Check email and check user with this email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new APIError("No user with this email", 404));
  }
  // 2) generate 6 random digits and save it to db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.resetCode = hashedResetCode;
  user.resetCodeExpiration = Date.now() + 60 * 10 * 1000;
  user.isResetCodeVerified = false;
  await user.save();

  try {
    const message = `Hi ${user.name},\n We received a request to reset the password on your BookStore Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The BookStore Team`;
    await sendEmail({
      email: user.email,
      subject: "Your reset code",
      message,
    });
  } catch (error) {
    user.resetCode = undefined;
    user.resetCodeExpiration = undefined;
    user.isResetCodeVerified = undefined;
    await user.save();
    return next(new APIError("Something went wrong"));
  }
  res.status(200).json({ msg: "Email send successfully", status: "Success" });
});

const verifyResetCode = asyncHandler(async (req, res, next) => {
  const resetCode = req.body.resetCode.toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await User.findOne({
    resetCode: hashedResetCode,
    resetCodeExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(new APIError("Invalid or expired reset code", 400));
  }

  user.isResetCodeVerified = true;
  await user.save();

  res
    .status(200)
    .json({ msg: "Reset code verified successfully", status: "Success" });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new APIError("Invalid email", 404));
  }
  if (!user.isResetCodeVerified) {
    return next(new APIError("Invalid or expired reset code", 400));
  }
  user.password = req.body.newPassword;
  user.isResetCodeVerified = undefined;
  user.resetCode = undefined;
  user.resetCodeExpiration = undefined;
  await user.save();

  const token = user.createToken({ userId: user._id, role: user.role });
  // res.cookie("token", token, { httpOnly: true });
  req.session.token = token;

  res
    .status(200)
    .json({ msg: "Password changed successfully", status: "Success" });
});

const logout = asyncHandler(async (req, res, next) => {
  if (req.session.token) {
    req.session.destroy();
  } else {
    return next(new APIError("You have to login first", 403));
  }

  res.status(200).json({ msg: "User LoggedOut", status: "Success" });
});

module.exports = {
  signup,
  login,
  protect,
  forgetPassword,
  verifyResetCode,
  resetPassword,
  logout,
};
