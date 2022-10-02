const express = require("express");
const { addToCart, getUserCart } = require("../controllers/cart");

const { protect } = require("../controllers/auth");

const router = express.Router();

router.post("/", protect("user"), addToCart);
router.get("/", protect("user"), getUserCart);

module.exports = router;
