const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    timezone: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
