const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");

const Coupon = require("../models/couponModel");

const Cart = require("../models/cartModel");

const calcTotalCartPrice = (cart) => {
  //Calculate Total cart price
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};
//@ desc Add product to Cart
//@ route Get /api/v1/cart
// @acess Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body; //in postman

  const product = await Product.findById(productId); //Get product

  // 1) Get Cart for Logged User
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // Create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    //Product exist in cart, update product quantity(increase)
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      //product not exist in cart, push product to cartItimes
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  //Calculate total cart price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "Success",
    message: "Product added to cart successfully",
    numofCartItems: cart.cartItems.length,
    data: cart,
  });
});
//@ desc Get logged user Cart
//@ route Get /api/v1/cart
// @acess Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id :${req.user._id}`, 404),
    );
  }
  res.status(200).json({
    status: "Success",
    numofCartItems: cart.cartItems.length,
    data: cart,
  });
});
//@ desc Remove Specific cart item
//@ route delete /api/v1/cart/:itemId
// @acess Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true },
  );
  calcTotalCartPrice(cart);
  cart.save();
  res.status(200).json({
    status: "Success",
    numofCartItems: cart.cartItems.length,
    data: cart,
  });
});
//@ desc Clear Logged user cart
//@ route delete /api/v1/cart
// @acess Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
//@ desc Update Specific cart item quantity
//@ route put /api/v1/cart/:itemId
// @acess Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body; //on postman
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`There is no cart for user ${req.user._id}`, 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId,
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is no item for this id:${req.params.itemId}`),
    );
  }
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "Success",
    numofCartItems: cart.cartItems.length,
    data: cart,
  });
});
//@ desc Apply coupon on logged user card
//@ route put /api/v1/cart/applycoupon
// @acess Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon, //on postman
    expire: { $gte: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }
  //2) Get Logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  //3) Calculate Price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "Success",
    numofCartItems: cart.cartItems.length,
    data: cart,
  });
});
