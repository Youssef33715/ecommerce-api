const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "To short SubCategory name"],
      mixlength: [32, "To long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      //means is a child from pranet
      type: mongoose.Schema.ObjectId,
      ref: "Category", //focus
      required: [true, "SubCategory must be belong to parent category"],
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("SubCategory", subCategorySchema);
