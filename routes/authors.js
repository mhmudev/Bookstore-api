const express = require("express");
const {
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthors,
} = require("../controllers/authors");
const { protect } = require("../controllers/auth");

const booksRoutes = require("./books");

const {
  createAuthorValidator,
  getAuthorValidator,
  deleteAuthorValidator,
  updateAuthorValidator,
} = require("../utils/validators/authorValidator");

const router = express.Router();

router.use("/:id/books", booksRoutes);

router
  .route("/:id")
  .get(getAuthorValidator, getAuthor)
  .put(protect("admin"), updateAuthorValidator, updateAuthor)
  .delete(protect("admin"), deleteAuthorValidator, deleteAuthor);
router
  .route("/")
  .get(getAuthors)
  .post(protect("admin"), createAuthorValidator, createAuthor);

module.exports = router;
