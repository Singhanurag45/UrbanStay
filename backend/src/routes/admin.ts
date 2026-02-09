import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics";
import verifyToken, { verifyAdmin } from "../middleware/auth";

const router = express.Router();

// New Analytics Endpoint
router.get("/analytics", verifyToken, verifyAdmin, getDashboardAnalytics);

export default router;