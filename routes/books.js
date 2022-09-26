const express = require("express");
const {
  createBook,
  getBook,
  updateBook,
  deleteBook,
  getBooks,
} = require("../controllers/books");
const {
  createBookValidator,
  getBookValidator,
  deleteBookValidator,
  updateBookValidator,
} = require("../utils/validators/bookValidator");
const { upload, resize } = require("../utils/multerHandler");
const router = express.Router({ mergeParams: true });

router
  .route("/:id")
  .get(getBookValidator, getBook)
  .put(updateBookValidator, updateBook)
  .delete(deleteBookValidator, deleteBook);

router
  .route("/")
  .get(getBooks)
  .post(
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]),
    resize,
    createBookValidator,
    createBook
  );

module.exports = router;
