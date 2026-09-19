const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true }, price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true }, category: { type: String, default: "" },
}, { _id: false });
const wishlistSchema = new mongoose.Schema({ userId: { type: String, required: true, unique: true }, items: { type: [itemSchema], default: [] } }, { timestamps: true });
module.exports = mongoose.model("Wishlist", wishlistSchema);
