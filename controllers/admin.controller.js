import { User } from "../models/user.model.js";
import { Log } from "../models/log.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ✅ Fetch all activity logs (with pagination)
export const getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // default pagination
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
    console.error(err);
    res.status(500).json({ message: "Error fetching logs" });
  }
};