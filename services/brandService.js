const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middleware/uploadimageMiddleware");
const Brand = require("../models/brandModel");

//upload Single image
exports.uploadBrandImage = uploadSingleImage("image");
//Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  //image processing
  const filename = `Brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  // Save image into our Data base
  req.body.image = filename;

  next();
});

//@ desc Get list of brands
//@ route Get /api/v1/brands
// @acess piblic
exports.getBrands = factory.getAll(Brand);
////////////////////////////////////////////
// @desc Get Specific brand by id
// @route Get /api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(Brand);

//@desc createBrand
//@route post /api/v1/Brand
//@access private

exports.createBrand = factory.createOne(Brand);
/////////////////////////////////////////
//@desc Update specific brand
//@route Put /api/v1/brands/:id
//@access private
exports.updateBrand = factory.updateOne(Brand);

////////////////////////////////////////////////
//@desc Delete specific brand
//@route Delete /api/v1/brands/:id
//@access private
exports.deleteBrand = factory.deleteOne(Brand);
