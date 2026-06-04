const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createfilterObj,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidtor,
  deleteSubCategoryValidtor,
} = require("../utils/validators/subCategoryValidator");

const authenService = require("../services/authService");

//mergeParams:Allow us to access paramters on other routers
// ex: we need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(createfilterObj, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authenService.protect,
    authenService.allowedTo("admin", "manager"),
    updateSubCategoryValidtor,
    updateSubCategory,
  )
  .delete(
    authenService.protect,
    authenService.allowedTo("admin"),
    deleteSubCategoryValidtor,
    deleteSubCategory,
  );

module.exports = router;
