import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'kenrestaurant_jwt_super_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Helper authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) req.user = null;
    else req.user = user;
    next();
  });
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập để thực hiện thao tác này' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Yêu cầu quyền Quản trị viên (Admin)' });
  }
  next();
};

app.use(authenticateToken);

// ==========================================
// 🔐 AUTHENTICATION APIS
// ==========================================

// Đăng ký tài khoản mới
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ Tên, Email và Mật khẩu' });
    }

    const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    const existing = checkStmt.get(email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được đăng ký tài khoản!' });
    }

    const userId = `user-${Date.now()}`;
    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, phone, address, role, verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'client', 1, ?)
    `);

    insertStmt.run(userId, name.trim(), email.trim().toLowerCase(), passwordHash, phone || '', address || '', now);

    const user = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      address: address || '',
      role: 'client',
      avatar: null,
      verified: true
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token, message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo tài khoản' });
  }
});

// Đăng nhập
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập Email và Mật khẩu' });
    }

    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email.trim().toLowerCase());

    if (!user) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email hoặc mật khẩu không chính xác' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'client',
      avatar: user.avatar || null,
      verified: Boolean(user.verified)
    };

    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: userData, token, message: 'Đăng nhập thành công!' });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
});

// Lấy thông tin tài khoản hiện tại
app.get('/api/auth/me', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, name, email, phone, address, role, avatar, verified FROM users WHERE id = ?');
    const user = stmt.get(req.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng' });
  }
});

// Cập nhật thông tin tài khoản
app.put('/api/auth/profile', requireAuth, (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const stmt = db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          avatar = COALESCE(?, avatar)
      WHERE id = ?
    `);
    stmt.run(name || null, phone || null, address || null, avatar || null, req.user.id);

    const userStmt = db.prepare('SELECT id, name, email, phone, address, role, avatar, verified FROM users WHERE id = ?');
    const updated = userStmt.get(req.user.id);
    res.json({ user: updated, message: 'Cập nhật thông tin thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật tài khoản' });
  }
});

// ==========================================
// 🍽️ FOODS & CATEGORIES APIS
// ==========================================

// Danh mục món ăn
app.get('/api/categories', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT c.id, c.name, c.icon, COUNT(f.id) as count
      FROM categories c
      LEFT JOIN foods f ON f.category_id = c.id
      GROUP BY c.id
    `);
    const list = stmt.all();

    // Tính tổng tất cả món
    const totalCountStmt = db.prepare('SELECT COUNT(*) as total FROM foods');
    const totalCount = totalCountStmt.get()?.total || 0;

    const categoriesWithAll = [
      { id: 'all', name: 'Tất cả', icon: '🍽️', count: totalCount },
      ...list
    ];

    res.json(categoriesWithAll);
  } catch (error) {
    console.error('Lỗi lấy danh mục:', error);
    res.status(500).json({ error: 'Lỗi khi tải danh mục món ăn' });
  }
});

// Danh sách món ăn (có hỗ trợ filter, search, sort)
app.get('/api/foods', (req, res) => {
  try {
    const { category, search, sortBy, dietary } = req.query;

    let query = 'SELECT * FROM foods WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (dietary === 'vegetarian') {
      query += ' AND is_vegetarian = 1';
    } else if (dietary === 'spicy') {
      query += ' AND is_spicy > 0';
    }

    if (sortBy === 'price-asc') {
      query += ' ORDER BY price ASC';
    } else if (sortBy === 'price-desc') {
      query += ' ORDER BY price DESC';
    } else if (sortBy === 'rating') {
      query += ' ORDER BY rating DESC';
    } else {
      query += ' ORDER BY is_best_seller DESC, rating DESC';
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    const foodsFormatted = rows.map(f => ({
      id: f.id,
      category: f.category_id,
      name: f.name,
      price: f.price,
      originalPrice: f.original_price,
      rating: f.rating,
      reviewsCount: f.reviews_count,
      prepTime: f.prep_time,
      calories: f.calories,
      image: f.image,
      description: f.description,
      isBestSeller: Boolean(f.is_best_seller),
      isChefSpecial: Boolean(f.is_chef_special),
      isSpicy: f.is_spicy,
      isVegetarian: Boolean(f.is_vegetarian),
      ingredients: f.ingredients ? JSON.parse(f.ingredients) : [],
      customizations: f.customizations ? JSON.parse(f.customizations) : { sizes: [], toppings: [] }
    }));

    res.json(foodsFormatted);
  } catch (error) {
    console.error('Lỗi lấy món ăn:', error);
    res.status(500).json({ error: 'Lỗi khi tải danh sách món ăn' });
  }
});

// Chi tiết 1 món ăn
app.get('/api/foods/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM foods WHERE id = ?');
    const f = stmt.get(req.params.id);

    if (!f) return res.status(404).json({ error: 'Không tìm thấy món ăn này' });

    res.json({
      id: f.id,
      category: f.category_id,
      name: f.name,
      price: f.price,
      originalPrice: f.original_price,
      rating: f.rating,
      reviewsCount: f.reviews_count,
      prepTime: f.prep_time,
      calories: f.calories,
      image: f.image,
      description: f.description,
      isBestSeller: Boolean(f.is_best_seller),
      isChefSpecial: Boolean(f.is_chef_special),
      isSpicy: f.is_spicy,
      isVegetarian: Boolean(f.is_vegetarian),
      ingredients: f.ingredients ? JSON.parse(f.ingredients) : [],
      customizations: f.customizations ? JSON.parse(f.customizations) : { sizes: [], toppings: [] }
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tải chi tiết món ăn' });
  }
});

// Admin: Thêm món ăn mới
app.post('/api/foods', requireAdmin, (req, res) => {
  try {
    const f = req.body;
    const foodId = f.id || `f-${Date.now()}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO foods (
        id, category_id, name, price, original_price, rating, reviews_count,
        prep_time, calories, image, description, is_best_seller, is_chef_special,
        is_spicy, is_vegetarian, ingredients, customizations, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      foodId,
      f.category || 'burger',
      f.name,
      f.price || 0,
      f.originalPrice || null,
      f.rating || 5.0,
      f.reviewsCount || 0,
      f.prepTime || '15-20 phút',
      f.calories || 500,
      f.image || '',
      f.description || '',
      f.isBestSeller ? 1 : 0,
      f.isChefSpecial ? 1 : 0,
      f.isSpicy || 0,
      f.isVegetarian ? 1 : 0,
      JSON.stringify(f.ingredients || []),
      JSON.stringify(f.customizations || { sizes: [], toppings: [] }),
      now
    );

    res.status(201).json({ id: foodId, message: 'Thêm món ăn thành công!' });
  } catch (error) {
    console.error('Lỗi thêm món:', error);
    res.status(500).json({ error: 'Lỗi khi thêm món ăn vào database' });
  }
});

// ==========================================
// 🎟️ VOUCHERS APIS
// ==========================================

app.get('/api/vouchers', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM vouchers');
    const rows = stmt.all();
    const formatted = rows.map(v => ({
      code: v.code,
      discount: v.discount,
      discountType: v.discount_type,
      minSpend: v.min_spend,
      maxDiscount: v.max_discount,
      description: v.description,
      expiry: v.expiry,
      badge: v.badge,
      gradient: v.gradient
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi tải vouchers' });
  }
});

// ==========================================
// 🛒 ORDERS APIS
// ==========================================

// Tạo đơn hàng mới
app.post('/api/orders', (req, res) => {
  try {
    const {
      customer,
      items,
      subtotal,
      deliveryFee,
      discount,
      tax,
      total,
      voucherCode,
      notes
    } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin giao hàng' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Giỏ hàng đang trống' });
    }

    const orderId = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    const userId = req.user ? req.user.id : null;

    const driverMock = {
      name: 'Nguyễn Văn Hùng',
      phone: '0988.123.456',
      rating: 4.95,
      vehicle: 'Honda Wave - 29A1-889.99',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    // Insert order
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, user_id, customer_name, customer_phone, customer_address, payment_method,
        notes, subtotal, delivery_fee, discount, tax, total, voucher_code, status,
        estimated_time, driver, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', '20-25 phút', ?, ?)
    `);

    insertOrder.run(
      orderId,
      userId,
      customer.name,
      customer.phone,
      customer.address,
      customer.paymentMethod || 'cod',
      notes || customer.notes || '',
      subtotal || 0,
      deliveryFee || 0,
      discount || 0,
      tax || 0,
      total || 0,
      voucherCode || null,
      JSON.stringify(driverMock),
      now
    );

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (
        order_id, food_id, food_name, quantity, unit_price, total_price, selected_size, selected_toppings
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(
        orderId,
        item.id || item.foodId || '',
        item.name || '',
        item.quantity || 1,
        item.unitPrice || 0,
        item.totalPrice || (item.unitPrice * (item.quantity || 1)),
        item.selectedSize?.name || '',
        JSON.stringify(item.selectedToppings || [])
      );
    }

    res.status(201).json({
      orderId,
      status: 'confirmed',
      createdAt: now,
      total,
      driver: driverMock,
      message: 'Đặt hàng thành công!'
    });
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error);
    res.status(500).json({ error: 'Lỗi khi lưu đơn hàng vào hệ thống' });
  }
});

// Tra cứu chi tiết đơn hàng (hỗ trợ Live Tracking)
app.get('/api/orders/:id', (req, res) => {
  try {
    const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const order = orderStmt.get(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }

    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    const items = itemsStmt.all(order.id);

    res.json({
      orderId: order.id,
      createdAt: order.created_at,
      status: order.status,
      estimatedTime: order.estimated_time,
      subtotal: order.subtotal,
      deliveryFee: order.delivery_fee,
      discount: order.discount,
      tax: order.tax,
      total: order.total,
      customer: {
        name: order.customer_name,
        phone: order.customer_phone,
        address: order.customer_address,
        paymentMethod: order.payment_method
      },
      driver: order.driver ? JSON.parse(order.driver) : null,
      items: items.map(i => ({
        foodId: i.food_id,
        name: i.food_name,
        quantity: i.quantity,
        unitPrice: i.unit_price,
        totalPrice: i.total_price,
        selectedSize: i.selected_size,
        selectedToppings: i.selected_toppings ? JSON.parse(i.selected_toppings) : []
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi tra cứu đơn hàng' });
  }
});

// Xem danh sách đơn hàng gần đây của người dùng
app.get('/api/orders/user/my-orders', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(req.user.id);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy lịch sử đơn hàng' });
  }
});

// Admin: Xem tất cả đơn hàng
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const rows = stmt.all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách đơn hàng cho admin' });
  }
});

// Admin: Cập nhật trạng thái đơn hàng
app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    stmt.run(status, req.params.id);
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công!' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi cập nhật trạng thái đơn hàng' });
  }
});

// ==========================================
// 📅 RESERVATIONS APIS (ĐẶT BÀN)
// ==========================================

// Đặt bàn mới
app.post('/api/reservations', (req, res) => {
  try {
    const { name, phone, email, guests, date, time, tableType, notes } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ error: 'Vui lòng cung cấp Tên, Số điện thoại, Ngày và Giờ đặt bàn' });
    }

    const resId = `RES-${Date.now()}`;
    const now = new Date().toISOString();
    const userId = req.user ? req.user.id : null;

    const stmt = db.prepare(`
      INSERT INTO reservations (
        id, user_id, customer_name, customer_phone, customer_email, guests_count,
        reservation_date, reservation_time, table_type, notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `);

    stmt.run(
      resId,
      userId,
      name.trim(),
      phone.trim(),
      email || '',
      Number(guests) || 2,
      date,
      time,
      tableType || 'standard',
      notes || '',
      now
    );

    res.status(201).json({
      reservationId: resId,
      message: 'Đặt bàn thành công! KenRestaurant sẽ liên hệ xác nhận trong ít phút.'
    });
  } catch (error) {
    console.error('Lỗi đặt bàn:', error);
    res.status(500).json({ error: 'Lỗi khi gửi yêu cầu đặt bàn' });
  }
});

// Admin: Xem danh sách đặt bàn
app.get('/api/admin/reservations', requireAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM reservations ORDER BY created_at DESC');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách đặt bàn' });
  }
});

// ==========================================
// ⭐ REVIEWS APIS
// ==========================================

// Lấy danh sách đánh giá
app.get('/api/reviews', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM reviews ORDER BY created_at DESC');
    const rows = stmt.all();
    const formatted = rows.map(r => ({
      id: r.id,
      name: r.user_name,
      avatar: r.avatar,
      rating: r.rating,
      dish: r.dish_name,
      comment: r.comment,
      verified: Boolean(r.verified),
      likes: r.likes,
      date: 'Gần đây'
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi tải đánh giá' });
  }
});

// Gửi đánh giá mới
app.post('/api/reviews', (req, res) => {
  try {
    const { name, rating, comment, dish, avatar } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Vui lòng nhập tên, số sao và nhận xét' });
    }

    const reviewId = `rev-${Date.now()}`;
    const now = new Date().toISOString();
    const userId = req.user ? req.user.id : null;

    const stmt = db.prepare(`
      INSERT INTO reviews (
        id, food_id, user_id, user_name, avatar, rating, dish_name, comment, verified, likes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?)
    `);

    stmt.run(
      reviewId,
      null,
      userId,
      name,
      avatar || null,
      Number(rating) || 5,
      dish || 'Món ăn tại KenRestaurant',
      comment,
      now
    );

    res.status(201).json({ reviewId, message: 'Cảm ơn bạn đã gửi đánh giá!' });
  } catch (error) {
    console.error('Lỗi gửi đánh giá:', error);
    res.status(500).json({ error: 'Lỗi lưu đánh giá' });
  }
});

// Root healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), database: 'SQLite (restaurant.db)' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 KenRestaurant API Server đang chạy tại: http://localhost:${PORT}`);
  });
}

export default app;
