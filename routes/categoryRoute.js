const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deletecategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const authenService = require("../services/authService");

const subcategoriesRoute = require("./subCategoryRoutes");

const router = express.Router();
//Nested route
router.use("/:categoryId/subcategories", subcategoriesRoute); //merge params
// Routes
router
  .route("/")
  .get(getCategories)
  .post(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(
    authenService.protect,
    authenService.allowedTo("admin"),
    deleteCategoryValidator,
    deletecategory,
  );
module.exports = router;
