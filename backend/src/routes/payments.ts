import express from "express";
import verifyToken from "../middleware/auth";
import { createOrder, confirmPayment } from "../controllers/payments";

const router = express.Router();

// URL: /api/payments/create-order
router.post("/create-order", verifyToken, createOrder);

// URL: /api/payments/confirm
router.post("/confirm", verifyToken, confirmPayment);

export default router;

