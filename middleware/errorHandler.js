const errorHandler = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong",
    statusCode: err.statusCode || 500,
    status: err.status || "Fail",
  };

  // Duplicate
  if (err.code && err.code == 11000) {
    customError.msg = `Email already exists ${err.keyValue.email}`;
    customError.statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    customError.msg = `Invalid token, try to login again`;
    customError.statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    customError.msg = `Token expired, try to login again`;
    customError.statusCode = 401;
  }
  return res
    .status(customError.statusCode)
    .json({ msg: customError.msg, status: customError.status });
};

module.exports = errorHandler;
