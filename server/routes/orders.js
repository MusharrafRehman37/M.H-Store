const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();
const CITY_RATES = { faisalabad:150, lahore:200, islamabad:200, rawalpindi:200, gujranwala:200, multan:220, sialkot:220, peshawar:250, quetta:300, karachi:300, hyderabad:300 };
const shippingFor = city => CITY_RATES[String(city || "").trim().toLowerCase()] ?? (String(city || "").trim() ? 250 : 0);
const findProduct = async id => {
  if (mongoose.isValidObjectId(id)) return Product.findById(id);
  if (/^\d+$/.test(String(id))) return Product.findOne({ productCode: Number(id) });
  return null;
};
const nextOrderNumber = async () => {
  const last = await Order.findOne({ orderNumber: { $type: "number" } }).sort({ orderNumber: -1 }).select("orderNumber");
  return Number(last?.orderNumber || 0) + 1;
};

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { customer, products, paymentMethod = "cash-on-delivery" } = req.body || {};
    if (!customer) return res.status(400).json({ message: "Customer information is required", isError: true });
    for (const field of ["fullName", "email", "phone", "address", "city"]) if (!String(customer[field] || "").trim()) return res.status(400).json({ message: "Complete shipping information is required", isError: true });
    if (!Array.isArray(products) || products.length === 0) return res.status(400).json({ message: "Order must contain products", isError: true });

    const orderProducts = [];
    for (const item of products) {
      const product = await findProduct(item.productId || item._id || item.id);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId || item._id || item.id}`, isError: true });
      const quantity = Number(item.quantity || 1);
      if (!Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: `Invalid quantity for ${product.name}`, isError: true });
      if (quantity > Number(product.stock || 0)) return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}`, isError: true });
      orderProducts.push({ productId: product._id, name: product.name, price: Number(product.price), image: product.image, quantity });
    }

    const subtotal = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCharge = shippingFor(customer.city);
    const total = subtotal + shippingCharge;
    const totalItems = orderProducts.reduce((sum, item) => sum + item.quantity, 0);
    const normalizedPayment = ["cash-on-delivery", "advance-payment", "card"].includes(paymentMethod) ? paymentMethod : "cash-on-delivery";
    const paymentStatus = normalizedPayment === "advance-payment" ? "Pending" : "Pending";

    const order = await Order.create({
      orderNumber: await nextOrderNumber(), userId: req.user.uid,
      customer: { fullName: customer.fullName.trim(), email: customer.email.trim().toLowerCase(), phone: customer.phone.trim(), address: customer.address.trim(), city: customer.city.trim(), postalCode: String(customer.postalCode || "").trim(), notes: String(customer.notes || "").trim() },
      products: orderProducts, subtotal, shippingCharge, total, totalItems,
      paymentMethod: normalizedPayment, paymentStatus, status: "Pending",
    });

    for (const item of orderProducts) await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    await Cart.findOneAndUpdate({ userId: req.user.uid }, { $set: { items: [] } });

    res.status(201).json({ message: "Order placed successfully", order, isError: false });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message || "Failed to place order", isError: true });
  }
});

router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ orders, isError: false });
  } catch (error) {
    console.error("My Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch your orders", isError: true });
  }
});

router.get("/my-orders/:id", authMiddleware, async (req, res) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { orderNumber: Number(req.params.id) };
    const order = await Order.findOne({ ...query, userId: req.user.uid });
    if (!order) return res.status(404).json({ message: "Order not found", isError: true });
    res.json({ order, isError: false });
  } catch (error) { res.status(400).json({ message: "Invalid order ID", isError: true }); }
});

router.get("/admin/all", authMiddleware, adminOnly, async (req, res) => {
  try { const orders = await Order.find().sort({ createdAt: -1 }); res.json({ orders, isError: false }); }
  catch (error) { console.error("Admin Orders Error:", error); res.status(500).json({ message: "Failed to fetch orders", isError: true }); }
});

router.get("/admin/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { orderNumber: Number(req.params.id) };
    const order = await Order.findOne(query);
    if (!order) return res.status(404).json({ message: "Order not found", isError: true });
    res.json({ order, isError: false });
  } catch (error) { res.status(400).json({ message: "Invalid order ID", isError: true }); }
});

router.put("/admin/:id/status", authMiddleware, adminOnly, async (req, res) => {
  try {
    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(req.body?.status)) return res.status(400).json({ message: "Invalid order status", isError: true });
    const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { orderNumber: Number(req.params.id) };
    const order = await Order.findOneAndUpdate(query, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: "Order not found", isError: true });
    res.json({ message: "Order status updated successfully", order, isError: false });
  } catch (error) { console.error("Update Order Status Error:", error); res.status(400).json({ message: "Failed to update order status", isError: true }); }
});

router.delete("/admin/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { orderNumber: Number(req.params.id) };
    const order = await Order.findOneAndDelete(query);
    if (!order) return res.status(404).json({ message: "Order not found", isError: true });
    res.json({ message: "Order deleted successfully", isError: false });
  } catch (error) { res.status(400).json({ message: "Failed to delete order", isError: true }); }
});

module.exports = router;
