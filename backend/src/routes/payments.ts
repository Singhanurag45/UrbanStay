import express from "express";
import verifyToken from "../middleware/auth";
import { createOrder, confirmPayment } from "../controllers/payments";
import { validateZod } from "../middleware/validateZod";
import { confirmPaymentBodySchema, createOrderBodySchema } from "../validation/zodSchemas";

const router = express.Router();

// URL: /api/payments/create-order
router.post(
  "/create-order",
  verifyToken,
  validateZod({ body: createOrderBodySchema }),
  createOrder
);

// URL: /api/payments/confirm
router.post(
  "/confirm",
  verifyToken,
  validateZod({ body: confirmPaymentBodySchema }),
  confirmPayment
);

export default router;

