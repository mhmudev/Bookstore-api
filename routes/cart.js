const express = require("express");
const {
  addToCart,
  getUserCart,
  removeCart,
  removeCartItem,
  updateCartItemsQuantity,
  applyCouponToCart,
} = require("../controllers/cart");

const { protect } = require("../controllers/auth");

const router = express.Router();

router.route("/applyCoupon").put(applyCouponToCart);

router
  .route("/")
  .post(protect("user"), addToCart)
  .get(protect("user"), getUserCart)
  .delete(removeCart);
router
  .route("/:itemId")
  .put(updateCartItemsQuantity)
  .delete(protect("user"), removeCartItem);

module.exports = router;
