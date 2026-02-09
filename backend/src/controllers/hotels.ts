import { Request, Response } from "express";
import Hotel from "../models/hotel";

export const searchHotels = async (req: Request, res: Response) => {
  try {
    const pageSize = 6;
    const pageNumber = Number(req.query.page) || 1;
    const skip = (pageNumber - 1) * pageSize;

    const query: any = {};

    if (req.query.destination) {
      const destination = req.query.destination.toString().toLowerCase();
      query.$or = [
        { cityLower: destination },
        { countryLower: destination },
      ];
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
    // Fetches all hotels, sorted by newest first
    // You can add .limit(20) here if you don't want to fetch thousands at once
    const hotels = await Hotel.find().sort({ lastUpdated: -1 });

    res.json(hotels);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};