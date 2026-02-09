import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth";
import bookingRoutes from "./routes/bookings";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotels";
import userRoutes from "./routes/users";
import adminRoutes from "./routes/admin"

// 1. Connect to Database
connectDB();

// 2. Init App
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Vercel frontend URL from environment variable
  "https://urban-stay-3tzl.vercel.app", // Old Vercel URL
  "https://urban-stay-smoky.vercel.app", // Current Vercel URL
  "https://urban-stay-3tzl-kfpz1zqje-anurag-singhs-projects-5f7d2241.vercel.app", // Preview deployments
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } 
      // Allow all Vercel preview deployments (wildcard pattern)
      else if (origin.includes(".vercel.app")) {
        callback(null, true);
      } 
      else {
        // Log the blocked origin for debugging
        console.log("Blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello from Hotel Booking Backend! Server is running.');
});

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes); // If you have user registration
app.use("/api/my-hotels", myHotelRoutes); // The Owner Dashboard Routes
app.use("/api/hotels", hotelRoutes); // The Public Search Routes
app.use("/api/admin", adminRoutes);

// 4. Health Check
app.get("/health", (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});

// 5. Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on localhost:${PORT}`);
});

