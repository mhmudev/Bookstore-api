const express = require("express");
const {
  addBookToWishlist,
  removeBookFromWishlist,
} = require("../controllers/wishlist");

const { protect } = require("../controllers/auth");

const router = express.Router();

router
  .post("/", protect("user"), addBookToWishlist)
  .delete("/:bookId", protect("user"), removeBookFromWishlist);

module.exports = router;
