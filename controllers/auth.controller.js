// controllers/auth.controller.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { mysqlDB } from "../config/db.mysql.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role_name } = req.body;

    // Check if user exists
    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Find role id
    const [roleRows] = await mysqlDB.execute("SELECT * FROM roles WHERE role_name = ?", [role_name]);
    if (roleRows.length === 0) return res.status(400).json({ message: "Invalid role" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.createUser(name, email, hashedPassword, roleRows[0].id);
    res.json({ message: "User registered successfully", userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const [roleRows] = await mysqlDB.execute("SELECT role_name FROM roles WHERE id = ?", [user.role_id]);
    const role_name = roleRows[0].role_name;

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id, role_name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role_name } });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
