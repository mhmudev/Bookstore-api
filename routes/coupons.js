const express = require("express");
const {
  createCoupon,
  deleteCoupon,
  updateCoupon,
  getCoupon,
  getCoupons,
} = require("../controllers/coupons");
const { protect } = require("../controllers/auth");

const router = express.Router();

router.use(protect("admin"));

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);
router.route("/").get(getCoupons).post(createCoupon);

module.exports = router;
