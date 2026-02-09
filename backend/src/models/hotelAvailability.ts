import mongoose from "mongoose";

const hotelAvailabilitySchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔐 CRITICAL UNIQUE LOCK
hotelAvailabilitySchema.index(
  { hotelId: 1, date: 1 },
  { unique: true }
);

const HotelAvailability = mongoose.model(
  "HotelAvailability",
  hotelAvailabilitySchema
);

export default HotelAvailability;
