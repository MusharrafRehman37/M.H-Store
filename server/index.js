const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");

const auth = require("./routes/auth");
const product = require("./routes/product");
const order = require("./routes/order");

const app = express();

const allowedOrigins = [
  "https://https://m-h-store2.vercel.app",
  "https://mh-store1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

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

// Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
  });
}

module.exports = app;