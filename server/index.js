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
      // Allow requests without an origin
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicitly handle preflight requests
app.options("*", cors());

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send(new Date().toLocaleString());
});

app.get("/health-check", (req, res) => {
  res.send("Server health is good");
});

app.use("/auth", auth);
app.use("/product", product);
app.use("/order", order);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});