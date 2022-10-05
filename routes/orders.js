const express = require("express");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderPayStatus,
  updateOrderDeliverStatus,
  checkOutSession,
} = require("../controllers/orders");
const { protect } = require("../controllers/auth");

const router = express.Router();

router.route("/").post(protect("user"), createOrder);
router.route("/").get(protect("user", "admin"), getOrders);
router.route("/:id").get(protect("user", "admin"), getOrder);
router.put("/:id/pay", protect("admin"), updateOrderPayStatus);
router.put("/:id/deliver", protect("admin"), updateOrderDeliverStatus);
router.get("/checkout/:id", protect("user"), checkOutSession);

module.exports = router;
