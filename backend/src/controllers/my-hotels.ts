import { Request, Response } from "express";
import Hotel from "../models/hotel";
import cloudinary from "../config/cloudinary";
import Booking from "../models/booking";

/* ================= IMAGE UPLOAD HELPER ================= */
const uploadImages = async (files: Express.Multer.File[]) => {
  return Promise.all(
    files.map(async (file) => {
      const base64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${base64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "hotels",
      });
      return uploadResult.secure_url;
    })
  );
};

/* ================= CREATE HOTEL ================= */
export const createHotel = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const body = req.body;

    const imageUrls = files?.length ? await uploadImages(files) : [];

    const hotel = new Hotel({
      ...body,
      userId: req.userId, // ObjectId
      cityLower: body.city?.toLowerCase(),
      countryLower: body.country?.toLowerCase(),
      imageUrls,
      lastUpdated: new Date(),
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    console.error("Create hotel error:", error);
    res.status(500).json({ message: "Create hotel failed" });
  }
};

/* ================= GET MY HOTELS ================= */
export const getMyHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId })
      .sort({ lastUpdated: -1 })
      .lean(); // 🚀 faster

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotels" });
  }
};

/* ================= GET MY HOTEL BY ID ================= */
export const getMyHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean();

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch hotel" });
  }
};

/* ================= UPDATE HOTEL ================= */
export const updateHotel = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const body = req.body;

    const hotel = await Hotel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (files?.length) {
      const newImages = await uploadImages(files);
      hotel.imageUrls = [...hotel.imageUrls, ...newImages];
    }

    // Update fields
    Object.assign(hotel, body);

    if (body.city) hotel.cityLower = body.city.toLowerCase();
    if (body.country) hotel.countryLower = body.country.toLowerCase();

    hotel.lastUpdated = new Date();

    await hotel.save();
    res.status(200).json(hotel);
  } catch (error) {
    console.error("Update hotel error:", error);
    res.status(500).json({ message: "Update hotel failed" });
  }
};

/* ================= DELETE HOTEL ================= */
export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.id;

    const hotel = await Hotel.findOne({
      _id: hotelId,
      userId: req.userId,
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Cascade delete bookings
    await Booking.deleteMany({ hotelId });

    // Delete hotel
    await Hotel.findByIdAndDelete(hotelId);

    res.status(200).json({
      message: "Hotel and associated bookings deleted successfully",
    });
  } catch (error) {
    console.error("Delete hotel error:", error);
    res.status(500).json({ message: "Error deleting hotel" });
  }
};
