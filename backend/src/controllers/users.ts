import { Request, Response } from "express";
import User from "../models/user";

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.userId; // This comes from the verifyToken middleware

  try {
    // Find user by ID but EXCLUDE the password field (-password)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Ideally, Registration logic usually sits here in a pure REST API
// But we already put it in auth.ts for simplicity.

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit;

    const query = search
      ? { $text: { $search: search } }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select("firstName lastName email role createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      search
        ? User.countDocuments({ $text: { $search: search } })
        : User.estimatedDocumentCount(),
    ]);

    res.json({
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};


// Delete User (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};