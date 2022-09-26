const asyncHandler = require("../middleware/asyncHandler");
const Book = require("../models/Book");
const APIError = require("../utils/APIError");
const APIFeatures = require("../utils/APIFeatures");

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
  const numOfDocs = await Book.countDocuments();
  const apiFeatures = new APIFeatures(req.query, Book.find());
  apiFeatures
    .fields()
    .filter()
    .search("Book")
    .sort()
    .getAuthorBooks(req.params.id)
    .paginate(numOfDocs);

  const { mongooseQuery, paginationResult } = apiFeatures;

  const books = await mongooseQuery;
  res.status(200).json({ paginationResult, length: books.length, books });
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
