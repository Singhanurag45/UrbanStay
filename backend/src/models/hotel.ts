import mongoose, { Document } from "mongoose";

const hotelSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  adultCount: { type: Number, required: true },
  childCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerNight: { type: Number, required: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, default: Date.now },

  cityLower: {
    type: String,
    index: true,
  },
  countryLower: {
    type: String,
    index: true,
  },
  
});

hotelSchema.index({
   cityLower: 1,
   countryLower: 1,
   pricePerNight: 1, 
   lastUpdated: -1   
});


const Hotel = mongoose.model("Hotel", hotelSchema);
export default Hotel;
