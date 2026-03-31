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
import { validateZod } from "../middleware/validateZod";
import { idParamSchema, myHotelBodySchema } from "../validation/zodSchemas";

const router = express.Router();


// NOTE: All these routes are protected by verifyToken
router.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 6),
  validateZod({ body: myHotelBodySchema }),
  createHotel
);
router.get("/", verifyToken, getMyHotels);
router.get("/:id", verifyToken, validateZod({ params: idParamSchema }), getMyHotelById);
router.put(
  "/:id",
  verifyToken,
  upload.array("imageFiles", 6),
  validateZod({ params: idParamSchema, body: myHotelBodySchema }),
  updateHotel
);
router.delete("/:id", verifyToken, validateZod({ params: idParamSchema }), deleteHotel);

export default router;
