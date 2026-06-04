const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const { uploadMixOfImages } = require("../middleware/uploadimageMiddleware");
const factory = require("./handlersFactory");

const Product = require("../models/productModel");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //  console.log(req.files);
  // 1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverfilename}`);

    // Save image into our Data base
    req.body.imageCover = imageCoverfilename;
  }
  //2- Image Proccessing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our Data base
        req.body.images.push(imageName);
      }),
    );
    next();
  }
});
//@ desc Get list of products
//@ route Get /api/v1/products
// @acess piblic
exports.getProducts = factory.getAll(Product, "Products");
////////////////////////////////////////////
// @desc Get Specific product by id
// @route Get /api/v1/product/:id
// @access public
exports.getProduct = factory.getOne(Product, "reviews");
//@desc createProduct
//@route post /api/v1/product
//@access private
exports.createProduct = factory.createOne(Product);

//@desc Update specific product
//@route Put /api/v1/Product/:id
//@access private Adimn only acess
exports.updateProduct = factory.updateOne(Product);

////////////////////////////////////////////////
//@desc Delete specific product
//@route Delete /api/v1/products/:id
//@access private
exports.deleteProduct = factory.deleteOne(Product);
