const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings values is 1.0"],
      max: [5, "Max retings values is 5.0"],
      required: [true, "review ratings required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    // Parent reference(One to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must be belong to Product"],
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, async function () {
  this.populate({ path: "user", select: "name" });
});

//Aggreagation
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId,
) {
  const result = await this.aggregate([
    // Stage 1:get all reviews in specific product
    {
      //one stage
      $match: { product: productId },
    },
    //Stage 2:Grouping reviews based on productsID and calc avgRatings,ratingsQuantity
    {
      $group: {
        _id: `$product`,
        avgRatings: { $avg: `$ratings` },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
// بيشتغل عند إنشاء تقييم جديد (save)
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
///
// ✅ هو ده السطر البديل والحديث اللي هيشغل الـ Update والـ Delete مع كود الفاكتوري بتاعك
reviewSchema.post(/^findOneAnd/, async (doc) => {
  if (doc) {
    // doc هنا هي وثيقة التقييم اللي تم تعديلها أو حذفها بالفعل
    // بناخد منها الـ product ID ونعيد الحساب للمنتج ده
    await doc.constructor.calcAverageRatingsAndQuantity(doc.product);
  }
});
// reviewSchema.post("deleteOne", async function () {
//   await this.constructor.calcAverageRatingsAndQuantity(this.product);
// });

module.exports = mongoose.model("Review", reviewSchema);
