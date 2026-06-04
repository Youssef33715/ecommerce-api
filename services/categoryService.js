const asyncHandler = require("express-async-handler");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");
const { uploadSingleImage } = require("../middleware/uploadimageMiddleware");
//upload Single image
exports.uploadCategoryImage = uploadSingleImage("image");
//Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  //image processing
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our Data base
    req.body.image = filename;
  }
  next();
});
//@ desc Get list of categories
//@ route Get /api/v1/categories
// @acess piblic

exports.getCategories = factory.getAll(Category);
////////////////////////////////////////////
// @desc Get Specific category by id
// @route Get /api/v1/categories/:id
// @access public
exports.getCategory = factory.getOne(Category);

//@desc createcategory
//@route post /api/v1/category
//@access private/Admin
exports.createCategory = factory.createOne(Category);

//@desc Update specific category
//@route Put /api/v1/categeries/:id
//@access private
exports.updateCategory = factory.updateOne(Category);

////////////////////////////////////////////////
//@desc Delete specific category
//@route Delete /api/v1/categeries/:id
//@access private
exports.deletecategory = factory.deleteOne(Category);
