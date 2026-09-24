require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("../config/db");
const authRoutes = require("../routes/auth");
const productRoutes = require("../routes/products");
const cartRoutes = require("../routes/cart");
const wishlistRoutes = require("../routes/wishlist");
const orderRoutes = require("../routes/orders");
const authMiddleware = require("../middleware/auth");

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGINS || "").split(",").map(v => v.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS origin not allowed"));
  },
  credentials: false,
}));
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));

app.get("/", (req, res) => res.json({ message: "M.H Store API is running", isError: false }));
app.get("/health-check", (req, res) => res.json({ message: "Server health is good", isError: false }));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/orders", orderRoutes);
app.get("/protected", authMiddleware, (req, res) => res.json({ message: "You can access this protected route", user: req.user, isError: false }));

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error", isError: true });
});

// Vercel serverless function: connect lazily and reuse the connection.
const handler = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ message: "Database connection failed", isError: true });
  }
};

module.exports = handler;
