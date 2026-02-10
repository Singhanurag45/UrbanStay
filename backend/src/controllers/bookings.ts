import mongoose from "mongoose";
import Booking from "../models/booking";
import Hotel from "../models/hotel";
import HotelAvailability from "../models/hotelAvailability";
import { Request, Response } from "express";

// Utility: generate date list
const getDatesBetween = (start: Date, end: Date) => {
  const dates: Date[] = [];
  const current = new Date(start);

  while (current < end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const createBooking = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { hotelId, checkIn, checkOut, totalCost } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1️⃣ Check hotel exists
    const hotel = await Hotel.findById(hotelId).session(session);
    if (!hotel) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Hotel not found" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const dates = getDatesBetween(start, end);

    // 2️⃣ Lock availability (THIS PREVENTS DOUBLE BOOKING)
    const availabilityDocs = dates.map((date) => ({
      hotelId,
      date,
    }));

    await HotelAvailability.insertMany(availabilityDocs, { session });

    // 3️⃣ Create booking
    await Booking.create(
      [
        {
          hotelId,
          userId: req.userId,
          checkIn: start,
          checkOut: end,
          totalCost,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Booking confirmed",
    });
  } catch (error: any) {
    await session.abortTransaction();

    // Unique constraint error = already booked
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Hotel already booked for selected dates",
      });
    }

    res.status(500).json({ message: "Booking failed" });
  } finally {
    session.endSession();
  }
};


export const getMyBookings = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("MY BOOKINGS USER:", req.userId);


    const bookings = await Booking.find({ userId: req.userId })
      .populate("hotelId", "name city country imageUrls")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};


export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10; // Default 10 per page
    const skip = (page - 1) * limit;

    // Run query and count in parallel for speed
    const [bookings, total] = await Promise.all([
      Booking.find()
        .populate("userId", "firstName lastName email")
        .populate("hotelId", "name city country")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(),
    ]);

    res.json({
      data: bookings,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};


export const cancelBooking = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await Booking.findById(req.params.id).session(session);

    if (!booking) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.userId.toString() !== req.userId) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // 1️⃣ Update booking status
    booking.status = "cancelled";
    await booking.save({ session });

    // 2️⃣ Free hotel availability
    await HotelAvailability.deleteMany(
      {
        hotelId: booking.hotelId,
        date: {
          $gte: booking.checkIn,
          $lt: booking.checkOut,
        },
      },
      { session }
    );

    await session.commitTransaction();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  } finally {
    session.endSession();
  }
};
