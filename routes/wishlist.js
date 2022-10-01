const express = require("express");
const {
  addBookToWishlist,
  removeBookFromWishlist,
  getLoggedUserWishlist,
} = require("../controllers/wishlist");

const { protect } = require("../controllers/auth");

const router = express.Router();

router
  .post("/", protect("user"), addBookToWishlist)
  .delete("/:bookId", protect("user"), removeBookFromWishlist)
  .get("/me", protect("user"), getLoggedUserWishlist);

module.exports = router;
