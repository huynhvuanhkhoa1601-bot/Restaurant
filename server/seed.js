import bcrypt from 'bcryptjs';
import { db, initSchema } from './db.js';
import { categories, foods, vouchers, reviews } from '../src/data/foods.js';

console.log('🔄 Đang khởi tạo và nạp dữ liệu mẫu (Seed Data) vào SQLite...');

initSchema();

// 1. Seed Users (Admin & Khách hàng mẫu)
const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, name, email, password_hash, phone, address, role, avatar, verified, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const adminHash = bcrypt.hashSync('Admin@2024', 10);
const clientHash = bcrypt.hashSync('KhachHang@123', 10);
const now = new Date().toISOString();

insertUser.run(
  'admin-001',
  'KenRestaurant Admin',
  'admin@kenrestaurant.vn',
  adminHash,
  '0334756330',
  'Toà nhà Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM',
  'admin',
  null,
  1,
  now
);

insertUser.run(
  'user-001',
  'Khách Hàng Thân Thiết',
  'khachhang@gourmetfeast.vn',
  clientHash,
  '0912.345.678',
  'Toà nhà Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM',
  'client',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  1,
  now
);

console.log('✅ Đã tạo 2 tài khoản mẫu: Admin (admin@kenrestaurant.vn / Admin@2024) và Khách hàng (khachhang@gourmetfeast.vn / KhachHang@123)');

// 2. Seed Categories
const insertCategory = db.prepare(`
  INSERT OR REPLACE INTO categories (id, name, icon, count)
  VALUES (?, ?, ?, ?)
`);

for (const cat of categories) {
  if (cat.id === 'all') continue; // Bỏ qua mục ảo 'all' trong DB
  insertCategory.run(cat.id, cat.name, cat.icon || '🍽️', cat.count || 0);
}
console.log(`✅ Đã nạp ${categories.filter(c => c.id !== 'all').length} danh mục món ăn`);

// 3. Seed Foods
const insertFood = db.prepare(`
  INSERT OR REPLACE INTO foods (
    id, category_id, name, price, original_price, rating, reviews_count,
    prep_time, calories, image, description, is_best_seller, is_chef_special,
    is_spicy, is_vegetarian, ingredients, customizations, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const f of foods) {
  insertFood.run(
    f.id,
    f.category,
    f.name,
    f.price,
    f.originalPrice || null,
    f.rating || 5.0,
    f.reviewsCount || 0,
    f.prepTime || '15-20 phút',
    f.calories || 500,
    f.image,
    f.description || '',
    f.isBestSeller ? 1 : 0,
    f.isChefSpecial ? 1 : 0,
    f.isSpicy || 0,
    f.isVegetarian ? 1 : 0,
    JSON.stringify(f.ingredients || []),
    JSON.stringify(f.customizations || { sizes: [], toppings: [] }),
    now
  );
}
console.log(`✅ Đã nạp ${foods.length} món ăn vào cơ sở dữ liệu`);

// Cập nhật lại số lượng món ăn thực tế cho từng danh mục
const updateCatCount = db.prepare(`
  UPDATE categories
  SET count = (SELECT COUNT(*) FROM foods WHERE foods.category_id = categories.id)
`);
updateCatCount.run();

// 4. Seed Vouchers
const insertVoucher = db.prepare(`
  INSERT OR REPLACE INTO vouchers (
    code, discount, discount_type, min_spend, max_discount, description, expiry, badge, gradient
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const v of vouchers) {
  insertVoucher.run(
    v.code,
    v.discount,
    v.discountType,
    v.minSpend || 0,
    v.maxDiscount || null,
    v.description || '',
    v.expiry || '',
    v.badge || '',
    v.gradient || 'from-orange-500 to-amber-500'
  );
}
console.log(`✅ Đã nạp ${vouchers.length} mã ưu đãi (vouchers)`);

// 5. Seed Reviews
const insertReview = db.prepare(`
  INSERT OR REPLACE INTO reviews (
    id, food_id, user_id, user_name, avatar, rating, dish_name, comment, verified, likes, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const r of reviews) {
  insertReview.run(
    r.id,
    null,
    null,
    r.name,
    r.avatar || null,
    r.rating || 5,
    r.dish || '',
    r.comment || '',
    r.verified ? 1 : 0,
    r.likes || 0,
    now
  );
}
console.log(`✅ Đã nạp ${reviews.length} đánh giá khách hàng`);

console.log('🎉 Hoàn tất nạp dữ liệu ban đầu vào SQLite (restaurant.db)!');
