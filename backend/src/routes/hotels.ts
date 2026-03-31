import express from "express";
import { getAllHotels ,searchHotels, getHotelById, getBookedDates } from "../controllers/hotels";
import { validateZod } from "../middleware/validateZod";
import {
  hotelIdParamSchema,
  idParamSchema,
  searchHotelsQuerySchema,
} from "../validation/zodSchemas";


const router = express.Router();

router.get("/search", validateZod({ query: searchHotelsQuerySchema }), searchHotels);
router.get(
  "/:hotelId/booked-dates",
  validateZod({ params: hotelIdParamSchema }),
  getBookedDates
);
router.get("/", getAllHotels);
router.get("/:id", validateZod({ params: idParamSchema }), getHotelById);



export default router;
