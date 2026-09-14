-- =========================================================================
-- 🍔 KENRESTAURANT - SUPABASE (POSTGRESQL) SCHEMA & SEED DATA
-- Hướng dẫn:
-- 1. Đăng nhập Supabase Dashboard -> Vào project của bạn
-- 2. Chọn menu 'SQL Editor' ở thanh bên trái -> 'New query'
-- 3. Dán toàn bộ nội dung file này vào và bấm 'Run' (hoặc nhấn Ctrl + Enter)
-- =========================================================================

-- 1. BẬT EXTENSION UUID (NẾU CẦN DÙNG VỀ SAU)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DỌN DẸP BẢNG CŨ (NẾU BẠN CẦN RESET LẠI TỪ ĐẦU)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS vouchers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================================================================
-- 3. KHỞI TẠO CÁC BẢNG DỮ LIỆU
-- =========================================================================

-- 3.1 Bảng Người dùng (Users & Admin)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    role TEXT DEFAULT 'client',
    avatar TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Bảng Danh mục món ăn (Categories)
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    count INTEGER DEFAULT 0
);

-- 3.3 Bảng Món ăn (Foods)
CREATE TABLE foods (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    rating REAL DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    prep_time TEXT,
    calories INTEGER,
    image TEXT,
    description TEXT,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_chef_special BOOLEAN DEFAULT FALSE,
    is_spicy INTEGER DEFAULT 0,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    ingredients JSONB DEFAULT '[]'::jsonb,
    customizations JSONB DEFAULT '{"sizes": [], "toppings": []}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Bảng Mã giảm giá (Vouchers)
CREATE TABLE vouchers (
    code TEXT PRIMARY KEY,
    discount NUMERIC NOT NULL,
    discount_type TEXT NOT NULL, -- 'fixed', 'percent', 'shipping'
    min_spend NUMERIC DEFAULT 0,
    max_discount NUMERIC,
    description TEXT,
    expiry TEXT,
    badge TEXT,
    gradient TEXT
);

-- 3.5 Bảng Đơn hàng (Orders)
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    payment_method TEXT DEFAULT 'cod',
    notes TEXT,
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    tax NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    voucher_code TEXT,
    status TEXT DEFAULT 'confirmed',
    estimated_time TEXT DEFAULT '20-25 phút',
    driver JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Bảng Chi tiết món ăn trong đơn hàng (Order Items)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    food_id TEXT,
    food_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    selected_size TEXT,
    selected_toppings JSONB DEFAULT '[]'::jsonb
);

-- 3.7 Bảng Đặt bàn (Reservations)
CREATE TABLE reservations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    guests_count INTEGER NOT NULL,
    reservation_date TEXT NOT NULL,
    reservation_time TEXT NOT NULL,
    table_type TEXT DEFAULT 'standard',
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Bảng Đánh giá của khách hàng (Reviews)
CREATE TABLE reviews (
    id TEXT PRIMARY KEY,
    food_id TEXT REFERENCES foods(id) ON DELETE SET NULL,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER NOT NULL,
    dish_name TEXT,
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- 4. PHÂN QUYỀN TRUY CẬP (ROW LEVEL SECURITY - RLS POLICIES)
-- Mở quyền để ứng dụng web của bạn có thể SELECT / INSERT từ client
-- =========================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Quyền ĐỌC (SELECT) công khai cho khách hàng
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Foods" ON foods FOR SELECT USING (true);
CREATE POLICY "Public Read Vouchers" ON vouchers FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Read Order Items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public Read Users" ON users FOR SELECT USING (true);

-- Quyền GHI (INSERT) cho khách hàng
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON users FOR UPDATE USING (true);

-- =========================================================================
-- 5. NẠP DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- =========================================================================

-- 5.1 Nạp Người Dùng Mẫu
INSERT INTO users (id, name, email, password_hash, phone, address, role, avatar, verified) VALUES
('admin-001', 'KenRestaurant Admin', 'admin@kenrestaurant.vn', '$2b$10$5rhDwb9./dAx6qUDCp5Z/Op4LZcxDwFhsSaVnGyMOoVKM.nO3hXS.', '0334756330', '133/50/4 Cống Lở, P.15, Q.Tân Bình, TP.HCM', 'admin', NULL, true),
('user-001', 'Khách Hàng Thân Thiết', 'khachhang@gourmetfeast.vn', '$2b$10$xbmBm5xlN3y9AhUi4pmRfucjxM7XnbcDkeRQXYzDZcfG.IskXuaki', '0912.345.678', 'Toà nhà Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM', 'client', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', true);

-- 5.2 Nạp Danh Mục Món Ăn
INSERT INTO categories (id, name, icon, count) VALUES
('burger', 'Burger & Bò', '🍔', 4),
('pizza', 'Pizza & Pasta', '🍕', 4),
('sushi', 'Sushi & Nhật', '🍣', 3),
('asian', 'Món Á & Phở', '🍜', 5),
('steak', 'Bít Tết & Nướng', '🥩', 3),
('healthy', 'Salad & Healthy', '🥗', 3),
('dessert', 'Tráng Miệng', '🍰', 3);

-- 5.3 Nạp Thực Đơn Món Ăn
INSERT INTO foods (id, category_id, name, price, original_price, rating, reviews_count, prep_time, calories, image, description, is_best_seller, is_chef_special, is_spicy, is_vegetarian, ingredients, customizations) VALUES
('f1', 'burger', 'Gourmet Wagyu Truffle Burger', 185000, 220000, 4.9, 328, '15-20 phút', 680, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'Thịt bò Wagyu Úc nướng sốt nấm Truffle hảo hạng, phô mai Cheddar tan chảy, hành tây caramel và xà lách giòn trên bánh brioche nướng bơ.', true, true, 0, false, '["Bò Wagyu A5 xay","Sốt Nấm Truffle Đen","Phô mai Cheddar Anh","Hành tây Caramel","Bánh Brioche mè"]'::jsonb, '{"sizes":[{"name":"Tiêu chuẩn (Single Patty)","priceOffset":0},{"name":"Double Wagyu Patty (+150g thịt)","priceOffset":65000},{"name":"Supreme Triple Patty","priceOffset":120000}],"toppings":[{"id":"t1","name":"Thêm Phô Mai Cheddar","price":20000},{"id":"t2","name":"Thịt Xông Khói Giòn","price":25000},{"id":"t3","name":"Sốt Nấm Truffle Thêm","price":30000},{"id":"t4","name":"Trứng Ốp La Lòng Đào","price":15000}]}'::jsonb),
('f2', 'pizza', 'Pizza Hải Sản Pesto Ý Thượng Hạng', 245000, 290000, 4.8, 240, '20-25 phút', 820, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 'Đế bánh ủ men tự nhiên 48h nướng củi giòn xốp, phủ sốt lá quế tây Pesto thơm lừng, tôm sú tươi, mực lá nướng và phô mai Mozzarella kéo sợi.', true, false, 0, false, '["Tôm sú tươi","Mực lá Đại Tây Dương","Sốt Pesto Genovese","Mozzarella tươi Ý","Cà chua bi sấy"]'::jsonb, '{"sizes":[{"name":"Cỡ Vừa (9 inch - 6 miếng)","priceOffset":0},{"name":"Cỡ Lớn (12 inch - 8 miếng)","priceOffset":70000},{"name":"Cỡ Tiệc (14 inch - 10 miếng)","priceOffset":130000}],"toppings":[{"id":"t5","name":"Gấp đôi Phô Mai Mozzarella","price":35000},{"id":"t6","name":"Viền Phô Mai Xúc Xích","price":45000},{"id":"t7","name":"Thêm Tôm Sú","price":40000}]}'::jsonb),
('f3', 'sushi', 'Combo Sushi Sashimi Hoàng Gia', 380000, 450000, 5, 195, '15-20 phút', 520, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80', 'Tuyển tập Sashimi cá hồi Nauy béo ngậy, sò điệp Nhật Bản, cá ngừ đại dương và Nigiri lươn nướng sốt Teriyaki đậm đà.', true, true, 0, false, '["Cá Hồi Nauy Tươi","Cá Ngừ Vây Vàng","Sò Điệp Hokkaido","Lươn Nhật Kabayaki","Trứng cá chuồn Tobiko"]'::jsonb, '{"sizes":[{"name":"Phần 1 Người (12 Pieces)","priceOffset":0},{"name":"Phần Đôi (22 Pieces)","priceOffset":160000},{"name":"Set Đại Tiệc (36 Pieces)","priceOffset":320000}],"toppings":[{"id":"t8","name":"Thêm Wasabi Tươi Shizuoka","price":15000},{"id":"t9","name":"Salad Rong Biển Mè","price":35000},{"id":"t10","name":"Súp Miso Rong Biển Đậu Hũ","price":25000}]}'::jsonb),
('f4', 'steak', 'Bò Bít Tết Ribeye Black Angus', 320000, 360000, 4.9, 180, '20-25 phút', 750, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 'Thịt thăn lưng bò Black Angus 250g áp chảo bơ tỏi lá hương thảo, kèm khoai tây nghiền mịn nhung sốt tiêu đen Phú Quốc hoặc sốt phô mai.', false, true, 1, false, '["Bò Black Angus Mỹ 250g","Khoai tây nghiền bơ Pháp","Măng tây nướng","Sốt tiêu đen Phú Quốc"]'::jsonb, '{"sizes":[{"name":"Khẩu phần 250g (Vừa ăn)","priceOffset":0},{"name":"Khẩu phần 350g (Đầy đặn)","priceOffset":95000}],"toppings":[{"id":"t11","name":"Sốt Gan Ngỗng Foie Gras","price":65000},{"id":"t12","name":"Măng Tây Xào Tỏi Bơ","price":30000},{"id":"t13","name":"Khoai Tây Nghiền Truffle","price":35000}]}'::jsonb),
('f5', 'asian', 'Phở Bò Thăn Wagyu Tái Lăn Trứng Chần', 135000, 155000, 4.8, 412, '10-15 phút', 590, 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 'Nước dùng phở ninh từ xương ống bò và thảo mộc trong 24 giờ, bánh phở tươi dẻo mướt, thăn bò Wagyu thái mỏng xào lăn tỏi gừng thơm phức.', true, false, 1, false, '["Bánh phở tươi Hà Nội","Thăn Bò Wagyu","Nước dùng thảo mộc 24h","Hành hoa & Quẩy giòn","Trứng gà ta lòng đào"]'::jsonb, '{"sizes":[{"name":"Tô Tiêu Chuẩn","priceOffset":0},{"name":"Tô Đặc Biệt (+Thịt Wagyu & Gầu Bò)","priceOffset":35000},{"name":"Tô Khổng Lồ Kèm Đuôi Bò","priceOffset":70000}],"toppings":[{"id":"t14","name":"Đĩa Quẩy Giòn (3 cái)","price":10000},{"id":"t15","name":"Trứng Gà Chần Nước Béo","price":12000},{"id":"t16","name":"Thêm Thịt Tái Lăn 100g","price":45000}]}'::jsonb),
('f6', 'healthy', 'Salad Ức Gà Nướng Bơ Quả Quinoa', 125000, 145000, 4.7, 156, '10-15 phút', 380, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', 'Salad tươi giòn với ức gà ướp sốt thảo mộc nướng mềm mọng, quả bơ sáp Đắk Lắk, hạt diêm mạch Quinoa, sốt mè rang béo ngậy.', false, false, 0, false, '["Ức gà thảo mộc nướng","Bơ sáp Đắk Lắk","Rau Rocket & Xà lách Romaine","Hạt Quinoa hữu cơ","Sốt mè rang Nhật"]'::jsonb, '{"sizes":[{"name":"Phần Tiêu Chuẩn (350g)","priceOffset":0},{"name":"Phần Fit Pro Double Protein (+150g ức gà)","priceOffset":35000}],"toppings":[{"id":"t17","name":"Thêm Bơ Sáp Thái Lát","price":20000},{"id":"t18","name":"Hạt Óc Chó & Hạnh Nhân Rang","price":25000},{"id":"t19","name":"Phô Mai Feta Hy Lạp","price":30000}]}'::jsonb),
('f7', 'burger', 'Bánh Mì Kẹp Gà Giòn Sốt Cay Hàn Quốc', 110000, 130000, 4.9, 289, '12-18 phút', 620, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 'Má đùi gà chiên vàng rụm tẩm sốt cay ngọt Gochujang chuẩn Hàn, bắp cải tím muối giòn tan và sốt Mayo tỏi ớt béo ngậy.', true, false, 2, false, '["Má đùi gà rút xương giòn","Sốt Gochujang cay ngọt","Bắp cải tím ngâm chua","Sốt Mayo kim chi"]'::jsonb, '{"sizes":[{"name":"Single Crispy Chicken","priceOffset":0},{"name":"Monster Double Chicken","priceOffset":45000}],"toppings":[{"id":"t20","name":"Phô Mai Kéo Sợi","price":20000},{"id":"t21","name":"Khoai Tây Chiên Lắc Phô Mai","price":30000}]}'::jsonb),
('f8', 'asian', 'Mì Ramen Xương Hầm Tonkotsu Chashu', 165000, 190000, 4.9, 374, '15-20 phút', 690, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80', 'Nước cốt xương hầm 18 giờ đậm đà béo thơm, sợi mì tươi Hakata thủ công, thịt ba chỉ Chashu hầm mềm tan trong miệng cùng trứng ngâm tương Ajitsuke Tamago.', true, true, 1, false, '["Sợi mì Ramen Hakata","Nước dùng Tonkotsu","Thịt Chashu nướng","Trứng lòng đào ngâm tương","Măng khô Menma"]'::jsonb, '{"sizes":[{"name":"Bát Tiêu Chuẩn","priceOffset":0},{"name":"Bát Đặc Biệt (+3 Lát Chashu)","priceOffset":40000}],"toppings":[{"id":"t22","name":"Thêm Trứng Ajitsuke Tamago","price":15000},{"id":"t23","name":"Thêm Sợi Mì Kaedama","price":20000},{"id":"t24","name":"Dầu Tỏi Đen Mayu","price":15000}]}'::jsonb),
('f9', 'pizza', 'Pizza Bốn Vị Phô Mai Mật Ong Ý (Quattro Formaggi)', 230000, 260000, 4.8, 168, '18-22 phút', 780, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80', 'Sự hòa quyện tuyệt hảo của 4 loại phô mai trứ danh: Mozzarella, Gorgonzola phô mai xanh, Parmesan và Ricotta, rưới mật ong rừng thơm ngọt ngào.', false, true, 0, true, '["Phô mai Mozzarella","Gorgonzola Blue Cheese","Parmigiano-Reggiano","Ricotta kem","Mật ong hoa rừng nguyên chất"]'::jsonb, '{"sizes":[{"name":"Cỡ Vừa (9 inch)","priceOffset":0},{"name":"Cỡ Lớn (12 inch)","priceOffset":65000}],"toppings":[{"id":"t25","name":"Mật Ong Rừng Thêm","price":15000},{"id":"t26","name":"Quả Óc Chó Nướng","price":25000}]}'::jsonb),
('f10', 'asian', 'Cơm Lươn Nhật Nướng Unadon Sốt Kabayaki', 265000, 310000, 5, 215, '15-20 phút', 610, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80', 'Lươn Nhật Bản nướng than hoa mềm rục, mọng nước phết sốt Kabayaki gia truyền óng ánh trên nền cơm gạo Nhật Koshihikari dẻo thơm.', false, true, 0, false, '["Lươn Unagi Nhật Bản","Gạo Nhật Koshihikari","Sốt Kabayaki cổ truyền","Bột ớt Sansho Nhật","Rong biển vụn"]'::jsonb, '{"sizes":[{"name":"Khẩu phần Tiêu Chuẩn (1/2 con lươn)","priceOffset":0},{"name":"Khẩu phần Thượng Hạng (Nguyên con lươn)","priceOffset":120000}],"toppings":[{"id":"t27","name":"Trứng Chiên Tamagoyaki","price":20000},{"id":"t28","name":"Canh Miso Rong Biển","price":20000}]}'::jsonb),
('f11', 'dessert', 'Bánh Tiramisu Ý Mascarpone Cà Phê Rượu Kahlúa', 85000, 99000, 4.9, 310, '5-10 phút', 340, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', 'Bánh ladyfinger nhúng cà phê Espresso đậm đặc và rượu mùi Kahlúa, xen kẽ các lớp kem phô mai Mascarpone béo mịn và phủ bột cacao nguyên chất đắng nhẹ.', true, true, 0, true, '["Phô mai Mascarpone Ý","Cà phê Espresso rang xay","Rượu mùi Kahlúa","Bánh Ladyfinger","Bột Cacao Bỉ"]'::jsonb, '{"sizes":[{"name":"Hộp Cá Nhân (150g)","priceOffset":0},{"name":"Hộp Đôi Chia Sẻ (300g)","priceOffset":65000}],"toppings":[{"id":"t29","name":"Dâu Tây Đà Lạt Tươi","price":25000},{"id":"t30","name":"Sốt Chocolate Bỉ Nóng Chảy","price":20000}]}'::jsonb),
('f12', 'dessert', 'Bánh Mousse Matcha Trà Xanh Kyoto', 79000, 95000, 4.8, 142, '5-10 phút', 290, 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80', 'Bột trà xanh Uji Kyoto hảo hạng hòa quyện kem tươi thanh nhẹ, đế bánh giòn bùi cùng đậu đỏ Azuki hầm đường ngọt dịu chuẩn vị Nhật.', false, false, 0, true, '["Bột Matcha Uji Kyoto","Đậu đỏ Azuki","Kem tươi Anchor","Chocolate trắng Valrhona"]'::jsonb, '{"sizes":[{"name":"Miếng Bánh Tam Giác","priceOffset":0},{"name":"Bánh Mini Tròn Sinh Nhật (10cm)","priceOffset":90000}],"toppings":[{"id":"t31","name":"Viên Kem Matcha","price":25000}]}'::jsonb),
('f13', 'asian', 'Cơm Tấm Sườn Bì Chả Đặc Biệt', 85000, 105000, 4.9, 120, '10-15 phút', 650, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', 'Sườn cốt lết nướng mật ong thơm lừng, chả trứng hấp béo ngậy, bì giòn dai và nước mắm kẹo chua ngọt.', true, false, 0, false, '["Sườn heo cốt lết","Gạo tấm thơm","Chả trứng thịt","Bì heo trộn thính","Mỡ hành tóp mỡ"]'::jsonb, '{"sizes":[{"name":"Dĩa Tiêu Chuẩn (1 Miếng Sườn)","priceOffset":0},{"name":"Dĩa Đặc Biệt (+Thêm 1 Sườn & Trứng Ốp La)","priceOffset":35000}],"toppings":[{"id":"t32","name":"Thêm Trứng Ốp La Lòng Đào","price":12000},{"id":"t33","name":"Thêm Chén Mỡ Hành Tóp Mỡ","price":8000},{"id":"t34","name":"Thêm Chả Trứng Hấp","price":15000}]}'::jsonb);

-- Cập nhật số lượng món ăn thực tế cho từng danh mục
UPDATE categories c
SET count = (SELECT COUNT(*) FROM foods f WHERE f.category_id = c.id);

-- 5.4 Nạp Mã Giảm Giá (Vouchers)
INSERT INTO vouchers (code, discount, discount_type, min_spend, max_discount, description, expiry, badge, gradient) VALUES
('KHOA', 50000, 'fixed', 250000, NULL, 'Giảm ngay 50.000đ cho đơn hàng từ 250k', 'Hết hạn hôm nay', 'HOT DEAL 🔥', 'from-orange-500 to-amber-500'),
('FREESHIP', 30000, 'shipping', 150000, NULL, 'Miễn phí giao hàng toàn quốc đơn từ 150k', 'Còn 3 ngày', 'FREESHIP 🚚', 'from-emerald-500 to-teal-600'),
('NEWBIE', 20, 'percent', 100000, 60000, 'Giảm 20% tối đa 60k cho khách hàng mới', 'Vĩnh viễn', 'MỚI 🎁', 'from-rose-500 to-pink-600'),
('GOURMET30', 30, 'percent', 400000, 100000, 'Giảm 30% tối đa 100k cho đơn ẩm thực thượng hạng', 'Cuối tuần này', 'VIP ⭐', 'from-purple-600 to-indigo-600');

-- 5.5 Nạp Đánh Giá Của Khách Hàng
INSERT INTO reviews (id, user_name, avatar, rating, dish_name, comment, verified, likes) VALUES
('r1', 'Anh Khoa', '/images/avatar-anh-khoa.jpg', 5, 'Gourmet Wagyu Truffle Burger', 'Burger ngon đỉnh chóp luôn mọi người ơi! Thịt bò Wagyu mềm ngọt mọng nước, sốt truffle thơm nức mũi. Giao hàng chỉ mất đúng 18 phút còn nóng hổi!', true, 24),
('r2', 'Quỳnh Giao', '/images/avatar-quynh-giao.jpg', 5, 'Combo Sushi Sashimi Hoàng Gia', 'Sashimi tươi rói, cá hồi béo ngậy không hề có mùi tanh. Đóng gói hộp giữ nhiệt cực kỳ sang trọng và chỉn chu. Rất xứng đáng với tầm giá 5 sao!', true, 19),
('r3', 'Thiên Kỳ', '/images/avatar-thien-ky.jpg', 5, 'Pizza Hải Sản Pesto Ý', 'Đế bánh giòn nhẹ, sốt Pesto thơm dịu rất khác biệt so với các quán pizza thông thường. Cả nhà mình ai ăn cũng khen nức nở.', true, 31),
('r4', 'Anh Pha', '/images/avatar-anh-pha.jpg', 5, 'Bò Bít Tết Ribeye Black Angus', 'Thịt bò nướng Medium Rare chuẩn xác từng ly. Khoai tây nghiền mịn tan, sốt tiêu thơm lừng. Chắc chắn sẽ tiếp tục ủng hộ quán dài lâu!', true, 15);
