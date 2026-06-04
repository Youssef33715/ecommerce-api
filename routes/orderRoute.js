const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderTopaid,
  updateOrderDelvered,
  checkoutSession,
} = require("../services/orderService");
const authenService = require("../services/authService");

const router = express.Router();
router.use(authenService.protect);
// Routes

router.get(
  "/checkout-session/:cartId",
  authenService.allowedTo("user"),
  checkoutSession,
);
////
router.route("/:cartId").post(authenService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authenService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders,
);
router.get("/:id", findSpecificOrder);

router.put(
  "/:id/pay",
  authenService.allowedTo("admin", "manager"),
  updateOrderTopaid,
);
router.put(
  "/:id/deliver",
  authenService.allowedTo("admin", "manager"),
  updateOrderDelvered,
);
module.exports = router;
