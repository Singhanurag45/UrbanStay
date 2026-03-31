import express from "express";
import verifyToken, { verifyAdmin } from "../middleware/auth";
import { cancelBooking, createBooking, getAllBookings, getMyBookings  } from "../controllers/bookings";
import { validateZod } from "../middleware/validateZod";
import { cancelBookingParamSchema, createBookingBodySchema, idParamSchema } from "../validation/zodSchemas";

const router = express.Router();

router.post("/", verifyToken, validateZod({ body: createBookingBodySchema }), createBooking);
router.get("/my", verifyToken, getMyBookings);
router.get("/all", verifyToken, verifyAdmin, getAllBookings);
router.patch(
  "/:id/cancel",
  verifyToken,
  validateZod({ params: cancelBookingParamSchema }),
  cancelBooking
);

export default router;
