import express from "express";
import { check } from "express-validator";
import verifyToken from "../middleware/auth";
import { login, register } from "../controllers/auth";

const router = express.Router();

/* LOGIN */
router.post(
  "/login",
  [check("email").isEmail(), check("password").isLength({ min: 6 })],
  login
);

/* REGISTER */
router.post(
  "/register",
  [
    check("firstName").notEmpty(),
    check("lastName").notEmpty(),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  register
);

/* VALIDATE TOKEN */
router.get("/validate-token", verifyToken, (req, res) => {
  res.status(200).json({ userId: req.userId });
});

/* LOGOUT */
router.post("/logout", (_req, res) => {
  res.cookie("auth_token", "", { expires: new Date(0) });
  res.sendStatus(200);
});

export default router;
