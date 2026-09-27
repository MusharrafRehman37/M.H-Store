const http = require("http");
const handler = require("./api/index");

if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  http.createServer((req, res) => handler(req, res)).listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
  });
}

module.exports = handler;
