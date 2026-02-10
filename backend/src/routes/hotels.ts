import express from "express";
import { getAllHotels ,searchHotels, getHotelById, getBookedDates } from "../controllers/hotels";


const router = express.Router();

router.get("/search", searchHotels);
router.get("/:hotelId/booked-dates", getBookedDates); 
router.get("/", getAllHotels);
router.get("/:id", getHotelById);



export default router;
