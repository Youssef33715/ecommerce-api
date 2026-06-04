const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

//@ desc Add product to wishlists
//@ route Post /api/v1/wishlist
// @acess protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  //$addToSet => add productId to wishlist array if productId not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "Success",
    message: "Product added successfully to your wishList.",
    date: user.wishlist,
  });
});
////////////////
//@ desc Remode product from wishlists
//@ route delete /api/v1/wishlist/:productId
// @acess protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  //$pull => remove productId from wishlist array if productId  exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "Success",
    message: "Product removed successfully from your wishList.",
    date: user.wishlist,
  });
});
////////////////
//@ desc Get logged user  wishlists
//@ route Get /api/v1/wishlist
// @acess protected/User
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "Success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
