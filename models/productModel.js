const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too Long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      // How many the product sold
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      // photo product
      type: String,
      required: [true, "Product Image cover"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable virsual populate (reviews)
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// make virtual name reviews and relate product with product id find Review
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
// Mongoose Query middleware
// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "category",
//     select: "name -_id",
//   });
//   next();
// });
// 1. مـيدل وير لجلب كل المنتجات
productSchema.pre("find", function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  if (typeof next === "function") next();
});

// 2. مـيدل وير لجلب منتج واحد (بالـ ID)
productSchema.pre("findOne", function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  if (typeof next === "function") next();
});
//////////////////////////
const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageslist = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imageslist.push(imageUrl);
    });
    doc.images = imageslist;
  }
};
// FindOne, findAll,update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});
// Save => Create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("product", productSchema);
