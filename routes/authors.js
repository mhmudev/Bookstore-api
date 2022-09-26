const express = require("express");
const {
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthors,
} = require("../controllers/authors");

const {
  createAuthorValidator,
  getAuthorValidator,
  deleteAuthorValidator,
  updateAuthorValidator,
} = require("../utils/validators/authorValidator");

const router = express.Router();

router
  .route("/:id")
  .get(getAuthorValidator, getAuthor)
  .put(updateAuthorValidator, updateAuthor)
  .delete(deleteAuthorValidator, deleteAuthor);
router.route("/").get(getAuthors).post(createAuthorValidator, createAuthor);

module.exports = router;
