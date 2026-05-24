import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics";
import verifyToken, { verifyAdmin } from "../middleware/auth";
import { validateZod } from "../middleware/validateZod";
import upload from "../middleware/multer";
import {
	getAllHotels,
	createAdminHotel,
	updateAdminHotel,
	deleteAdminHotel,
} from "../controllers/hotels";
import { idParamSchema, myHotelBodySchema } from "../validation/zodSchemas";

const router = express.Router();

// Analytics
router.get("/analytics", verifyToken, verifyAdmin, getDashboardAnalytics);

// Admin hotel management
router.get("/hotels", verifyToken, verifyAdmin, getAllHotels);

router.post(
	"/hotels",
	verifyToken,
	verifyAdmin,
	upload.array("imageFiles", 6),
	validateZod({ body: myHotelBodySchema }),
	createAdminHotel,
);

router.put(
	"/hotels/:id",
	verifyToken,
	verifyAdmin,
	upload.array("imageFiles", 6),
	validateZod({ params: idParamSchema, body: myHotelBodySchema }),
	updateAdminHotel,
);

router.delete(
	"/hotels/:id",
	verifyToken,
	verifyAdmin,
	validateZod({ params: idParamSchema }),
	deleteAdminHotel,
);

export default router;