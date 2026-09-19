const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();

const findProduct = async id => {
  if (mongoose.isValidObjectId(id)) return Product.findById(id);
  if (/^\d+$/.test(String(id))) return Product.findOne({ productCode: Number(id) });
  return null;
};

const nextProductCode = async () => {
  const last = await Product.findOne({ productCode: { $type: "number" } }).sort({ productCode: -1 }).select("productCode");
  return Number(last?.productCode || 0) + 1;
};

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ message: "Products fetched successfully", products, isError: false });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Failed to fetch products", isError: true });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found", isError: true });
    res.json({ product, isError: false });
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID", isError: true });
  }
});

router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, category, price, image, description = "", stock = 0, rating = 0, reviews = 0, featured = false } = req.body || {};
    if (!String(name || "").trim() || !String(category || "").trim() || price === undefined || !String(image || "").trim()) {
      return res.status(400).json({ message: "Name, category, price and image are required", isError: true });
    }
    const product = await Product.create({ productCode: await nextProductCode(), name: name.trim(), category: category.trim(), price: Number(price), image: String(image).trim(), description: String(description || "").trim(), stock: Number(stock), rating: Number(rating), reviews: Number(reviews), featured: Boolean(featured) });
    res.status(201).json({ message: "Product created successfully", product, isError: false });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ message: error.message || "Failed to create product", isError: true });
  }
});

router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found", isError: true });
    const allowed = ["name", "category", "price", "image", "description", "stock", "rating", "reviews", "featured"];
    for (const key of allowed) if (req.body[key] !== undefined) product[key] = req.body[key];
    await product.save();
    res.json({ message: "Product updated successfully", product, isError: false });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(400).json({ message: error.message || "Failed to update product", isError: true });
  }
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const product = await findProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found", isError: true });
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product deleted successfully", productId: product._id, isError: false });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(400).json({ message: "Failed to delete product", isError: true });
  }
});

module.exports = router;
