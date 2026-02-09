import express from "express";
import {
  createHotel,
  getMyHotels,
  getMyHotelById,
  updateHotel,
  deleteHotel
} from "../controllers/my-hotels";
import verifyToken, { verifyAdmin } from "../middleware/auth";
import upload from "../middleware/multer";

const router = express.Router();


// NOTE: All these routes are protected by verifyToken
router.post("/", verifyToken, [upload.array("imageFiles", 6)], createHotel);
router.get("/", verifyToken, getMyHotels);
router.get("/:id", verifyToken, getMyHotelById);
router.put("/:id", verifyToken, [upload.array("imageFiles", 6)], updateHotel);
router.delete("/:id", verifyToken, deleteHotel);

export default router;
