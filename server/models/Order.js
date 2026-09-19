const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true, sparse: true, index: true },
  userId: { type: String, required: true, index: true },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  products: { type: [orderItemSchema], required: true, validate: v => v.length > 0 },
  subtotal: { type: Number, required: true, min: 0 },
  shippingCharge: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  totalItems: { type: Number, required: true, min: 1 },
  paymentMethod: { type: String, enum: ["cash-on-delivery", "advance-payment", "card"], default: "cash-on-delivery" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
