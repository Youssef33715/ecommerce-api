const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const authenService = require("../services/authService");

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");

const router = express.Router();

// Routes
router
  .route("/")
  .get(getBrands)
  .post(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand,
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand,
  )
  .delete(
    authenService.protect,
    authenService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand,
  );
module.exports = router;
