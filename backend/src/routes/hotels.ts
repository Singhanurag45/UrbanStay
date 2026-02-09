import express from "express";
import { getAllHotels ,searchHotels, getHotelById } from "../controllers/hotels";


const router = express.Router();

router.get("/search", searchHotels);
router.get("/", getAllHotels);
router.get("/:id", getHotelById);


export default router;
