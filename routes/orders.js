const express = require("express");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderPayStatus,
  updateOrderDeliverStatus,
} = require("../controllers/orders");
const { protect } = require("../controllers/auth");

const router = express.Router();

router.route("/").post(protect("user"), createOrder);
router.route("/").get(protect("user", "admin"), getOrders);
router.route("/:id").get(protect("user", "admin"), getOrder);
router.put("/:id/pay", protect("admin"), updateOrderPayStatus);
router.put("/:id/deliver", protect("admin"), updateOrderDeliverStatus);

module.exports = router;
