const express = require("express");
const cors = require("cors");
const appHandler = require("./api/index");
const PORT = process.env.PORT || 8000;

if (require.main === module) {
  const localApp = express();

  // Local server ke liye CORS enable kiya gaya hai
  localApp.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

  localApp.use(express.json());
  localApp.use(appHandler);

  localApp.listen(PORT, () =>
    console.log(`Server is running on Port ${PORT}`)
  );
}

module.exports = appHandler;