import express from "express";
import verifyToken from "../middleware/auth";
import { validateZod } from "../middleware/validateZod";
import {
  authLoginSchema,
  authSignupRequestSchema,
  authSignupVerifySchema,
} from "../validation/zodSchemas";
import { login, requestSignupOtp, verifySignupOtp } from "../controllers/auth";

const router = express.Router();

/* LOGIN */
router.post("/login", validateZod({ body: authLoginSchema }), login);

/* REGISTER */
router.post(
  "/register",
  validateZod({ body: authSignupRequestSchema }),
  requestSignupOtp,
);

router.post(
  "/register/request-otp",
  validateZod({ body: authSignupRequestSchema }),
  requestSignupOtp,
);

router.post(
  "/register/verify-otp",
  validateZod({ body: authSignupVerifySchema }),
  verifySignupOtp,
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
