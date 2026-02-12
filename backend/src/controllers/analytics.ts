import { Request, Response } from "express";
import Booking from "../models/booking";
import User from "../models/user";


export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    // 1. Monthly Bookings & Revenue (Last 6 Months)
    const monthlyStats = await Booking.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" }, 
            year: { $year: "$createdAt" } 
          },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalCost" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);

    // Format for frontend (e.g., "Jan 2024")
    const formattedMonthly = monthlyStats.map(item => {
      const date = new Date();
      date.setMonth(item._id.month - 1);
      date.setFullYear(item._id.year);
      return {
        name: date.toLocaleString('default', { month: 'short' }),
        bookings: item.bookings,
        revenue: item.revenue
      };
    });

    // 2. Hotel Popularity (Top 5)
    const hotelStats = await Booking.aggregate([
      { $group: { _id: "$hotelId", bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      { 
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "_id",
          as: "hotelInfo"
        }
      },
      { $unwind: "$hotelInfo" },
      {
        $project: {
          name: "$hotelInfo.name",
          bookings: 1
        }
      }
    ]);

    // 3. User Growth (Last 6 Months)
    const userStats = await User.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          users: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
      { $limit: 6 }
    ]);

    const formattedUserGrowth = userStats.map(item => {
        const date = new Date();
        date.setMonth(item._id.month - 1);
        return {
            name: date.toLocaleString('default', { month: 'short' }),
            users: item.users
        };
    });

    // 4. Cancellation Stats
    const cancellationStats = await Booking.aggregate([
      {
        $group: {
          _id: "$status", // Assumes you have 'confirmed' or 'cancelled' in status
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Map to simple array
    const formattedCancellations = cancellationStats.map(stat => ({
        name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
        value: stat.count
    }));

    res.json({
      monthlyStats: formattedMonthly,
      hotelStats,
      userGrowth: formattedUserGrowth,
      cancellationStats: formattedCancellations
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};