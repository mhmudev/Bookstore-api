const express = require("express");
const { addToCart } = require("../controllers/cart");

const { protect } = require("../controllers/auth");

const router = express.Router();

router.post("/", protect("user"), addToCart);

module.exports = router;
