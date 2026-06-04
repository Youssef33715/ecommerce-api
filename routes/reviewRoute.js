const express = require("express");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  createfilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

const authenService = require("../services/authService");

const router = express.Router({ mergeParams: true }); //mergeparams to make access ProductId

// Routes
router
  .route("/")
  .get(createfilterObj, getReviews)
  .post(
    authenService.protect,
    authenService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authenService.protect,
    authenService.allowedTo("user"),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authenService.protect,
    authenService.allowedTo("admin", "user", "manager"),
    deleteReviewValidator,
    deleteReview,
  );
module.exports = router;
