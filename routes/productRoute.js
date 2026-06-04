const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

const authenService = require("../services/authService");

const reviewRoute = require("./reviewRoute");

const router = express.Router();
// Nested route
// Post /products/sgdgdgeef/reviews
// Get /products/ asvdvevdv/reviews

router.use("/:productId/reviews", reviewRoute); //merge params

// Routes
router
  .route("/")
  .get(getProducts)
  .post(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(
    authenService.protect,
    authenService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct,
  );
module.exports = router;
