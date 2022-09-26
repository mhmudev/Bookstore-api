const asyncHandler = require("../middleware/asyncHandler");
const Book = require("../models/Book");
const APIError = require("../utils/APIError");

const createBook = asyncHandler(async (req, res, next) => {
  const book = await Book.create({ ...req.body });
  res.status(201).json(book);
});

const updateBook = asyncHandler(async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findByIdAndUpdate({ _id: bookId }, { ...req.body });
  res.status(200).json(book);
});

const deleteBook = asyncHandler(async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findByIdAndDelete({ _id: bookId });
  res.status(200).json(book);
});

const getBooks = asyncHandler(async (req, res, next) => {
  const books = await Book.find({});
  res.status(200).json(books);
});

const getBook = asyncHandler(async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findById({ _id: bookId });
  if (!book) {
    return next(new APIError(`Book with id doesn't exist`, 404));
  }
  res.status(200).json(book);
});

module.exports = { createBook, updateBook, deleteBook, getBook, getBooks };
