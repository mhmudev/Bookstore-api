const express = require("express");
const {
  addToCart,
  getUserCart,
  removeCartItem,
} = require("../controllers/cart");

const { protect } = require("../controllers/auth");

const router = express.Router();

router.post("/", protect("user"), addToCart);
router.get("/", protect("user"), getUserCart);
router.delete("/:itemId", protect("user"), removeCartItem);

module.exports = router;
