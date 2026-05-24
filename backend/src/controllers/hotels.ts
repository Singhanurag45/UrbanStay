import { Request, Response } from "express";
import Hotel from "../models/hotel";
import Booking from "../models/booking";
import cloudinary from "../config/cloudinary";

export const searchHotels = async (req: Request, res: Response) => {
  try {
    const pageSize = 12;
    const pageNumber = Number(req.query.page) || 1;
    const skip = (pageNumber - 1) * pageSize;

    const query: any = {};

    if (req.query.destination) {
      const destination = req.query.destination.toString().toLowerCase();
      query.$or = [{ cityLower: destination }, { countryLower: destination }];
    }

    if (req.query.facilities) {
      query.facilities = {
        $all: Array.isArray(req.query.facilities)
          ? req.query.facilities
          : [req.query.facilities],
      };
    }

    if (req.query.maxPrice) {
      query.pricePerNight = {
        $lte: Number(req.query.maxPrice),
      };
    }

    const [hotels, total] = await Promise.all([
      Hotel.find(query)
        .sort({ lastUpdated: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Hotel.countDocuments(query),
    ]);

    res.json({
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 2. Get Single Hotel Detail
export const getHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotel" });
  }
};

// 3. Get All Hotels (Simple List)
export const getAllHotels = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [hotels, total] = await Promise.all([
      Hotel.find().sort({ lastUpdated: -1 }).skip(skip).limit(limit).lean(),
      Hotel.countDocuments(),
    ]);

    res.json({
      data: hotels,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

export const getBookedDates = async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;

    const bookings = await Booking.find({ hotelId }).select("checkIn checkOut");

    const bookedRanges = bookings.map((b) => ({
      checkIn: b.checkIn,
      checkOut: b.checkOut,
    }));

    res.json(bookedRanges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booked dates" });
  }
};

/* ================= IMAGE UPLOAD HELPER (Admin use) ================= */
const uploadImages = async (files: Express.Multer.File[] | undefined) => {
  if (!files || !files.length) return [];
  return Promise.all(
    files.map(async (file) => {
      const base64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${base64}`;
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "hotels",
      });
      return uploadResult.secure_url;
    }),
  );
};

/* ================= ADMIN: CREATE HOTEL ================= */
export const createAdminHotel = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const body = req.body;

    const imageUrls = files?.length ? await uploadImages(files) : [];

    const hotel = new Hotel({
      ...body,
      // Admin-created hotels are owned by the authenticated admin user.
      userId: req.userId,
      cityLower: body.city?.toLowerCase(),
      countryLower: body.country?.toLowerCase(),
      imageUrls,
      lastUpdated: new Date(),
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    console.error("Admin create hotel error:", error);
    res.status(500).json({ message: "Create hotel failed" });
  }
};

/* ================= ADMIN: UPDATE HOTEL ================= */
export const updateAdminHotel = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const body = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (files?.length) {
      const newImages = await uploadImages(files);
      hotel.imageUrls = [...hotel.imageUrls, ...newImages];
    }

    Object.assign(hotel, body);

    if (body.city) hotel.cityLower = body.city.toLowerCase();
    if (body.country) hotel.countryLower = body.country.toLowerCase();

    hotel.lastUpdated = new Date();

    await hotel.save();
    res.status(200).json(hotel);
  } catch (error) {
    console.error("Admin update hotel error:", error);
    res.status(500).json({ message: "Update hotel failed" });
  }
};

/* ================= ADMIN: DELETE HOTEL ================= */
export const deleteAdminHotel = async (req: Request, res: Response) => {
  try {
    const hotelId = req.params.id;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Cascade delete bookings
    await Booking.deleteMany({ hotelId });

    // Delete hotel
    await Hotel.findByIdAndDelete(hotelId);

    res
      .status(200)
      .json({ message: "Hotel and associated bookings deleted successfully" });
  } catch (error) {
    console.error("Admin delete hotel error:", error);
    res.status(500).json({ message: "Error deleting hotel" });
  }
};
