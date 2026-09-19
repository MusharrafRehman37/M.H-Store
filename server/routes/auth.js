const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/auth");
const authMiddleware = require("../middleware/auth");
const { adminOnly } = require("../middleware/auth");

const router = express.Router();
const normalizeEmail = email => String(email || "").trim().toLowerCase();
const makeUid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
const publicUser = user => ({
  id: user._id,
  _id: user._id,
  uid: user.uid,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) return res.status(400).json({ message: "Email is required", isError: true });
    const user = await Users.findOne({ email });
    if (!user || user.status !== "active") return res.status(404).json({ message: "User not found", isError: true });
    return res.json({ message: "Password reset request received", isError: false });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal Server Error", isError: true });
  }
});

router.post("/register", async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || "").trim();
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required", isError: true });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters", isError: true });

    const existing = await Users.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists. If an admin deleted this account, it must be removed from the database before the same email can register again.", isError: true });

    const user = await Users.create({ uid: makeUid(), fullName, email, password: await bcrypt.hash(password, 10), role: "customer", status: "active" });
    return res.status(201).json({ message: "A new user has been successfully created", isError: false, user: publicUser(user) });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error", isError: true });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    if (!email || !password) return res.status(400).json({ message: "Email and password are required", isError: true });

    const user = await Users.findOne({ email });
    if (!user || user.status !== "active") return res.status(401).json({ message: "Invalid email or password", isError: true });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password", isError: true });

    const token = jwt.sign({ uid: user.uid, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.json({ message: "Login successful", isError: false, token, user: publicUser(user) });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error", isError: true });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await Users.findOne({ uid: req.user.uid });
  if (!user || user.status !== "active") return res.status(401).json({ message: "Account is not active", isError: true });
  res.json({ user: publicUser(user), isError: false });
});

router.get("/admin/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await Users.find({ status: { $ne: "deleted" } }).select("-password").sort({ createdAt: -1 });
    res.json({ users: users.map(publicUser), isError: false });
  } catch (error) {
    console.error("Admin Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users", isError: true });
  }
});

router.delete("/admin/users/:uid", authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await Users.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found", isError: true });
    if (user.role === "admin") return res.status(400).json({ message: "Admin users cannot be deleted", isError: true });
    await Users.deleteOne({ _id: user._id });
    return res.json({ message: "User deleted successfully. The same email can register again.", deletedUserId: user._id, isError: false });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user", isError: true });
  }
});

module.exports = router;
