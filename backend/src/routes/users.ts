import express from "express";
import { getCurrentUser , getAllUsers , deleteUser } from "../controllers/users";
import verifyToken, { verifyAdmin } from "../middleware/auth";

const router = express.Router();

// URL: /api/users/me
router.get("/me", verifyToken, getCurrentUser);
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.delete("/:userId", verifyToken, verifyAdmin, deleteUser);

export default router;
