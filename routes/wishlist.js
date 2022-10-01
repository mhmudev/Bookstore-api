const express = require("express");
const { addBookToWishlist } = require("../controllers/wishlist");

const { protect } = require("../controllers/auth");

const router = express.Router();

router.route("/").post(protect("user"), addBookToWishlist);

module.exports = router;
