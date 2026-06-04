const factory = require("./handlersFactory");

const SubCategory = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
//@desc Subcreatecategory
//@route post /api/v1/subcategory
//@access private
exports.createSubCategory = factory.createOne(SubCategory);

//Nested route
// Get /api/

exports.createfilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

//@ desc Get list of Subcategories
//@ route Get /api/v1/Subcategories
// @acess piblic
exports.getSubCategories = factory.getAll(SubCategory);

////////////////////////////////////////////
// @desc Get Specific subcategory by id
// @route Get /api/v1/subcategories/:id
// @access public
exports.getSubCategory = factory.getOne(SubCategory);

//@desc Update specific subcategory
//@route Put /api/v1/subcategeries/:id
//@access private

exports.updateSubCategory = factory.updateOne(SubCategory);

////////////////////////////////////////////////
//@desc Delete specific Subcategory
//@route Delete /api/v1/Subcategeries/:id
//@access private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
