const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

//@ desc Get list of Coupons
//@ route Get /api/v1/coupons
// @acess Private/Admin
exports.getCoupons = factory.getAll(Coupon);
////////////////////////////////////////////
// @desc Get Specific coupon by id
// @route Get /api/v1/coupons/:id
// @access private
exports.getCoupon = factory.getOne(Coupon);

//@desc create Coupon
//@route post /api/v1/coupons
//@access private/Adimn

exports.createCoupon = factory.createOne(Coupon);
/////////////////////////////////////////
//@desc Update specific coupon
//@route Put /api/v1/coupons/:id
//@access private
exports.updateCoupon = factory.updateOne(Coupon);

////////////////////////////////////////////////
//@desc Delete specific coupon
//@route Delete /api/v1/coupons/:id
//@access private
exports.deleteCoupon = factory.deleteOne(Coupon);
