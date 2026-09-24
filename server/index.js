const appHandler = require("./api/index");
const PORT = process.env.PORT || 8000;

if (require.main === module) {
  const express = require("express");
  const localApp = express();
  localApp.use(appHandler);
  localApp.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
}

module.exports = appHandler;
