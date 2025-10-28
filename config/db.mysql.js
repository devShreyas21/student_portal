// config/db.mysql.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables first

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

// Safety check
if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  console.error("❌ Missing MySQL environment variables");
  process.exit(1);
}

export const mysqlDB = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // adjust as needed
  queueLimit: 0
});

console.log("✅ MySQL connected successfully");
