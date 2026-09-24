const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");

const auth = require("./routes/auth");
const product = require("./routes/product");
const order = require("./routes/order");

const app = express();

const allowedOrigins = [
  "https://mh-store1.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", auth);
app.use("/product", product);
app.use("/order", order);

connectDB();

app.get("/", (req, res) => {
  res.send(new Date().toLocaleString());
});

app.get("/health-check", (req, res) => {
  res.send("Server health is good");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});