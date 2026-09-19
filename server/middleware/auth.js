const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token is required", isError: true });
    }

    const token = header.slice(7).trim();
    if (!token) return res.status(401).json({ message: "Invalid authorization format", isError: true });

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid or expired token", isError: true });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only.", isError: true });
  }
  next();
};

module.exports = authMiddleware;
module.exports.adminOnly = adminOnly;
