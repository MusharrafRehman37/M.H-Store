const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGO_URI is not configured");
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
      .catch((error) => { connectionPromise = null; throw error; });
  }
  await connectionPromise;
  return mongoose.connection;
};

module.exports = { connectDB };
