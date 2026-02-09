import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("✅ Database connected successfully" , process.env.MONGODB_CONNECTION_STRING);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

connectDB();