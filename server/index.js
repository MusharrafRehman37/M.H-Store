require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:5173,http://localhost:3000").split(",").map(v => v.trim()).filter(Boolean);

app.use(cors({ origin: (origin, callback) => { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); callback(new Error("CORS origin not allowed")); }, credentials: true }));
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

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
