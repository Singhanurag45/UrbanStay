import express from "express";
import verifyToken, { verifyAdmin } from "../middleware/auth";
import { createBooking, getAllBookings, getMyBookings  } from "../controllers/bookings";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, getMyBookings);
router.get("/all", verifyToken, verifyAdmin, getAllBookings);

export default router;
