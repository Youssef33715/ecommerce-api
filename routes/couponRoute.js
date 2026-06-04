const express = require("express");

const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const authenService = require("../services/authService");

const router = express.Router();

router.use(authenService.protect, authenService.allowedTo("admin", "manager"));
// Routes
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);
module.exports = router;
