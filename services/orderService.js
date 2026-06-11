const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");

const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

//@desc Create cash order
// @route Post /Api/v1/orders/cardId
// @access Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app seettings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get Cart depend on CartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`),
    );
  }
  //2) Get order price depend on card price "Check if coupon applyed"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) Created order with default paymentMethodType cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  // 4) AfterCreating order,decrement product Quantity,increment product sold (Product Model)
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product || item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    // 5) Clear card depend on cardId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "Success", data: order });
});
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
//@desc Get all orders
// @route Post /Api/v1/orders
// @access Protected/User-Admin-Manger
exports.findAllOrders = factory.getAll(Order);
////
//@desc Get speccific orders
// @route Post /Api/v1/ordersId
// @access Protected/User-Admin-Manger
exports.findSpecificOrder = factory.getOne(Order);
///
//@desc Update order paid status to paid
// @route put /Api/v1/orders/:id/pay
// @access Protected/Admin-Manger
exports.updateOrderTopaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no such a order with:${req.params.id}`, 404),
    );
  }
  // Update order to paid
  order.ispaid = true;
  order.paidAt = Date.now();

  const updateOrder = await order.save();

  res.status(200).json({ status: "Sucess", date: updateOrder });
});
///
//@desc Update order devlivered status
// @route put /Api/v1/orders/:id/deliver
// @access Protected/Admin-Manger
exports.updateOrderDelvered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no such a order with:${req.params.id}`, 404),
    );
  }
  // Update order to delvier
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updateOrder = await order.save();

  res.status(200).json({ status: "Sucess", date: updateOrder });
});
////////////////////////////////////////////////(Stripe)
//@desc Get Checkout session from stripe and send it as response
// @route Get /Api/v1/orders/checkout-session/cartId
// @access Protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // app seettings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get Cart depend on CartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`),
    );
  }
  //2) Get order price depend on card price "Check if coupon applyed"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        //name: req.user.name,
        price_data: {
          unit_amount: totalOrderPrice * 100,
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  // 4) Send session to response
  res.status(200).json({ status: `success`, session });
});
///AT END PROJECT
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("Created Order Here .....");
  }
});
