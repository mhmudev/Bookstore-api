const errorHandler = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong",
    statusCode: err.statusCode || 500,
    status: err.status || "Fail",
  };
  return res
    .status(customError.statusCode)
    .json({ msg: customError.msg, status: customError.status });
};

module.exports = errorHandler;
