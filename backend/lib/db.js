import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  console.log("⏳ Connecting to MongoDB...",process.env.MONGODB_URI);

  if (mongoose.connection.readyState >= 1) {
    console.log("♻️ MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}
