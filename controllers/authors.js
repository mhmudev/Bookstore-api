const asyncHandler = require("../middleware/asyncHandler");
const Author = require("../models/Author");
const APIError = require("../utils/APIError");

const createAuthor = asyncHandler(async (req, res, next) => {
  const author = await Author.create(req.body);
  res.status(201).json(author);
});

const updateAuthor = asyncHandler(async (req, res, next) => {
  const authorId = req.params.id;
  const author = await Author.findByIdAndUpdate(
    { _id: authorId },
    { ...req.body }
  );
  res.status(200).json(author);
});

const deleteAuthor = asyncHandler(async (req, res, next) => {
  const authorId = req.params.id;
  const author = await Author.findByIdAndDelete({ _id: authorId });
  res.status(200).json(author);
});

const getAuthors = asyncHandler(async (req, res, next) => {
  const authors = await Author.find({});
  res.status(200).json(authors);
});

const getAuthor = asyncHandler(async (req, res, next) => {
  const authorId = req.params.id;
  const author = await Author.findById({ _id: authorId });
  if (!author) {
    return next(new APIError(`Author with id doesn't exist`, 404));
  }
  res.status(200).json(author);
});

module.exports = {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthor,
  getAuthors,
};
