import express from "express";
import verifyToken, { verifyAdmin } from "../middleware/auth";
import { cancelBooking, createBooking, getAllBookings, getMyBookings  } from "../controllers/bookings";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, getMyBookings);
router.get("/all", verifyToken, verifyAdmin, getAllBookings);
router.patch("/:id/cancel", verifyToken, cancelBooking);

export default router;
