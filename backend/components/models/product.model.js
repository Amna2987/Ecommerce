const mongoose = require("mongoose");

// Product schema definition
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
      },
    ],
    rating: { type: Number, default: 0 },
    reviews: [
      {
        review: { type: String},
        rating: { type: Number, default: 0 },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewedOn: {type: String, default: () => new Date().toISOString().split("T")[0]},
      },
    ],
    isFeatured: { type: Boolean, default: false },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
