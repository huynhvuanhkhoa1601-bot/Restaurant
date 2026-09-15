import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let DB_PATH = path.join(__dirname, 'restaurant.db');

// Hỗ trợ môi trường Vercel Serverless (thư mục deploy là read-only, chỉ cho phép ghi vào /tmp)
if (process.env.VERCEL) {
  const tmpDb = path.join('/tmp', 'restaurant.db');
  try {
    if (!fs.existsSync(tmpDb) && fs.existsSync(DB_PATH)) {
      fs.copyFileSync(DB_PATH, tmpDb);
    }
  } catch (e) {
    console.warn('Lỗi copy database sang /tmp:', e);
  }
  DB_PATH = tmpDb;
}

// Khởi tạo database SQLite
export const db = new DatabaseSync(DB_PATH);

// Bật Foreign Keys và WAL mode
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Khởi tạo các bảng dữ liệu
export const initSchema = () => {
  db.exec(`
    -- Bảng người dùng (Users & Admin)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT DEFAULT 'client',
      avatar TEXT,
      verified INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    -- Bảng danh mục món ăn (Categories)
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      count INTEGER DEFAULT 0
    );

    -- Bảng món ăn (Foods)
    CREATE TABLE IF NOT EXISTS foods (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      prep_time TEXT,
      calories INTEGER,
      image TEXT,
      description TEXT,
      is_best_seller INTEGER DEFAULT 0,
      is_chef_special INTEGER DEFAULT 0,
      is_spicy INTEGER DEFAULT 0,
      is_vegetarian INTEGER DEFAULT 0,
      ingredients TEXT,
      customizations TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    -- Bảng mã giảm giá (Vouchers)
    CREATE TABLE IF NOT EXISTS vouchers (
      code TEXT PRIMARY KEY,
      discount INTEGER NOT NULL,
      discount_type TEXT NOT NULL,
      min_spend INTEGER DEFAULT 0,
      max_discount INTEGER,
      description TEXT,
      expiry TEXT,
      badge TEXT,
      gradient TEXT
    );

    -- Bảng đơn hàng (Orders)
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      payment_method TEXT DEFAULT 'cod',
      notes TEXT,
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER DEFAULT 0,
      discount INTEGER DEFAULT 0,
      tax INTEGER DEFAULT 0,
      total INTEGER NOT NULL,
      voucher_code TEXT,
      status TEXT DEFAULT 'confirmed',
      estimated_time TEXT DEFAULT '20-25 phút',
      driver TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Bảng chi tiết món ăn trong đơn hàng (Order Items)
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      food_id TEXT,
      food_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      total_price INTEGER NOT NULL,
      selected_size TEXT,
      selected_toppings TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    -- Bảng đặt bàn (Reservations)
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      guests_count INTEGER NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      table_type TEXT DEFAULT 'standard',
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Bảng đánh giá của khách hàng (Reviews)
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      food_id TEXT,
      user_id TEXT,
      user_name TEXT NOT NULL,
      avatar TEXT,
      rating INTEGER NOT NULL,
      dish_name TEXT,
      comment TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      likes INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Migration an toàn bổ sung cột gọi món tại bàn nếu database đã tồn tại
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN order_type TEXT DEFAULT 'delivery'`);
  } catch (_) {}
  try {
    db.exec(`ALTER TABLE orders ADD COLUMN table_number TEXT`);
  } catch (_) {}
};

// Gọi khởi tạo schema ngay khi nạp module
initSchema();
