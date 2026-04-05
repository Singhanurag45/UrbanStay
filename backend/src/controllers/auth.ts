import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";

import { sendSignupOtpEmail, sendWelcomeEmail } from "../config/brevo";
import User from "../models/user";

const OTP_TTL_MINUTES = 10;

const generateOtp = () => String(randomInt(100000, 1000000));

const createAuthToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "2d",
  });

const setAuthCookie = (res: Response, token: string) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (user.isVerified === false) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = createAuthToken(user.id);
    setAuthCookie(res, token);
    return res.status(200).json({ userId: user._id, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const requestSignupOtp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user?.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
      user.isVerified = false;
      user.otpHash = otpHash;
      user.otpExpiresAt = otpExpiresAt;
    } else {
      user = new User({
        firstName,
        lastName,
        email,
        password,
        isVerified: false,
        otpHash,
        otpExpiresAt,
      });
    }

    await user.save();

    await sendSignupOtpEmail({
      email,
      firstName,
      otp,
    });

    return res.status(200).json({
      message: "OTP sent to your email address",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send OTP email. Please try again.";

    console.error("Signup OTP request failed:", error);
    return res.status(500).json({ message });
  }
};

export const verifySignupOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email, isVerified: false });

    if (!user) {
      return res.status(400).json({
        message: "Signup session not found. Please request a new OTP.",
      });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        message: "OTP session is not available. Please request a new OTP.",
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new code.",
      });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otpHash);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = createAuthToken(user.id);
    setAuthCookie(res, token);

    try {
      await sendWelcomeEmail({
        email: user.email,
        firstName: user.firstName,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return res.status(200).json({
      message: "Email verified successfully",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
