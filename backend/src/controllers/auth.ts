import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "2d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true, 
      sameSite: "none",
      maxAge: 86400000,
    });
    res.status(200).json({ userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const register = async (req: Request, res: Response) => {
  // Basic logic similar to login, but using `new User(req.body).save()`
  // Omitted for brevity, let me know if you need the full code
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User(req.body);
    await user.save();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1d" }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 86400000,
    });
    return res.status(200).send({ message: "User registered OK" });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
  }
};
