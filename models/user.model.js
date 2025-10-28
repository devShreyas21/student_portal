import { mysqlDB } from "../config/db.mysql.js";

export class User {
  static async createUser(name, email, hashedPassword, role_id) {
    const [result] = await mysqlDB.execute(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role_id]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await mysqlDB.execute("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await mysqlDB.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  static async getAllUsers() {
    const [rows] = await mysqlDB.execute(
      "SELECT users.id, users.name, users.email, roles.role_name FROM users JOIN roles ON users.role_id = roles.id"
    );
    return rows;
  }
}
