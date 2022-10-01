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
const { protect } = require("../controllers/auth");
const reviewsRoute = require("./reviews");

const router = express.Router({ mergeParams: true });

router.use("/:id/reviews", reviewsRoute);

router
  .route("/:id")
  .get(getBookValidator, getBook)
  .put(protect("admin"), updateBookValidator, updateBook)
  .delete(protect("admin"), deleteBookValidator, deleteBook);

router
  .route("/")
  .get(getBooks)
  .post(
    protect("admin"),
    protect("admin"),
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]),
    resize,
    createBookValidator,
    createBook
  );

module.exports = router;
