// controllers/admin.controller.js
import { User } from "../models/user.model.js";
import { Log } from "../models/log.model.js";
import bcrypt from "bcryptjs";

// ✅ Get all registered users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ Fetch all activity logs (with pagination)
export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Log.countDocuments();
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Error fetching logs" });
  }
};

// ✅ Add new user (Admin only)
export const addUser = async (req, res) => {
  try {
    const { name, email, password, role_name } = req.body;

    if (!name || !email || !password || !role_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role_name,
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// ✅ Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (Number(req.user.id) === Number(id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteById(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
