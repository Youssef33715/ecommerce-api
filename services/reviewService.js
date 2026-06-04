const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

//Nested route
// Get /api/v1/products/:productId/reviews
exports.createfilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

//@ desc Get list of reviews
//@ route Get /api/v1/reviews
// @acess piblic
exports.getReviews = factory.getAll(Review);
////////////////////////////////////////////
// @desc Get Specific review by id
// @route Get /api/v1/review/:id
// @access public
exports.getReview = factory.getOne(Review);

//Nested route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  //Nested route(Create)
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
//@desc create review
//@route post /api/v1/review
//@access private/protect/user

exports.createReview = factory.createOne(Review);
/////////////////////////////////////////
//@desc Update specific review
//@route Put /api/v1/reviews/:id
//@access private/Protect
exports.updateReview = factory.updateOne(Review);

////////////////////////////////////////////////
//@desc Delete specific review
//@route Delete /api/v1/review/:id
//@access private/protect/user/Adimn/manager
exports.deleteReview = factory.deleteOne(Review);
