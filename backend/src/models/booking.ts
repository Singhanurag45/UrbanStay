import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: { type: String, default: "confirmed" }, 
  },
  { timestamps: true }
);

// Prevent overlapping bookings
bookingSchema.index({
  hotelId: 1,
  checkIn: 1,
  checkOut: 1,
});

// For fast "My Bookings" fetch
bookingSchema.index({ userId: 1, createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
