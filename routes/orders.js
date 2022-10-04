const express = require("express");
const { createOrder } = require("../controllers/orders");
const { protect } = require("../controllers/auth");

const router = express.Router();

router.use(protect("user"));

// router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);
router.route("/").post(createOrder);

module.exports = router;
