// models/user.model.js
import { mysqlDB } from "../config/db.mysql.js";

export class User {
  // ✅ Create new user
  static async create({ name, email, password, role_name }) {
    // 1️⃣ Get role_id from role_name
    const [roleRows] = await mysqlDB.execute(
      "SELECT id FROM roles WHERE role_name = ?",
      [role_name.toLowerCase()]
    );

    if (roleRows.length === 0) {
      throw new Error(`Role '${role_name}' not found`);
    }

    const role_id = roleRows[0].id;

    // 2️⃣ Insert new user
    const [result] = await mysqlDB.execute(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, password, role_id]
    );

    return { id: result.insertId, name, email, role_name };
  }

  // ✅ Find user by email
  static async findByEmail(email) {
    const [rows] = await mysqlDB.execute(
      `SELECT users.*, roles.role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE email = ?`,
      [email]
    );
    return rows[0];
  }

  // ✅ Get user by ID
  static async getById(id) {
    const [rows] = await mysqlDB.execute(
      `SELECT users.*, roles.role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE users.id = ?`,
      [id]
    );
    return rows[0];
  }

  // ✅ Get all users (with role)
  static async getAllUsers() {
    const [rows] = await mysqlDB.execute(
      `SELECT users.id, users.name, users.email, roles.role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       ORDER BY users.id ASC`
    );
    return rows;
  }

  // ✅ Delete user
  static async deleteById(id) {
    await mysqlDB.execute("DELETE FROM users WHERE id = ?", [id]);
  }
}
