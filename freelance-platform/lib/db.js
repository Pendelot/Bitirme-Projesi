import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Çevre değişkenlerini yükle

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
  queueLimit: 0,
});

async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL bağlantısı başarılı!");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL bağlantı hatası:", err);
  }
}

testDBConnection();

export default pool;
