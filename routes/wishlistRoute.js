const express = require("express");

const authenService = require("../services/authService");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.use(authenService.protect, authenService.allowedTo("user"));
// Routes
router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
