-- ============================================================
-- 🗄️ SUPABASE SCHEMA - KenRestaurant Database
-- ⚠️  MIGRATION SCRIPT - Chạy trong Supabase SQL Editor
-- Phiên bản: 2.0 — Đồng bộ toàn bộ thông tin khách hàng
-- ============================================================

-- ── XÓA BẢNG CŨ (nếu có, theo thứ tự phụ thuộc) ───────────
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.table_sessions CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ── 1. BẢNG NGƯỜI DÙNG (users) ─────────────────────────────
CREATE TABLE public.users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  phone         TEXT,
  address       TEXT,
  role          TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  avatar        TEXT,
  verified      BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. BẢNG ĐẶT BÀN (reservations) ────────────────────────
CREATE TABLE public.reservations (
  id            BIGSERIAL PRIMARY KEY,
  user_id       TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  email         TEXT,
  phone         TEXT NOT NULL,
  guests        INTEGER NOT NULL DEFAULT 2,
  date          TEXT NOT NULL,
  time          TEXT NOT NULL,
  table_type    TEXT,
  notes         TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. BẢNG PHIÊN NGỒI BÀN (table_sessions) ─────────────────
-- Ghi lại mỗi khi khách quét mã QR hoặc chọn bàn ăn
CREATE TABLE public.table_sessions (
  id             BIGSERIAL PRIMARY KEY,
  user_id        TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name  TEXT,
  customer_phone TEXT,
  table_code     TEXT NOT NULL,
  table_name     TEXT NOT NULL,
  table_area     TEXT,
  table_floor    TEXT,
  session_type   TEXT DEFAULT 'scan' CHECK (session_type IN ('scan', 'manual', 'url_param', 'layout_click')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. BẢNG ĐƠN HÀNG (orders) ──────────────────────────────
CREATE TABLE public.orders (
  id               TEXT PRIMARY KEY,
  user_id          TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  customer_name    TEXT,
  customer_phone   TEXT,
  customer_address TEXT,
  customer_email   TEXT,
  payment_method   TEXT DEFAULT 'cod',
  notes            TEXT,
  delivery_type    TEXT DEFAULT 'now' CHECK (delivery_type IN ('now', 'scheduled', 'dine_in')),
  scheduled_time   TEXT,
  subtotal         NUMERIC(12,2) DEFAULT 0,
  delivery_fee     NUMERIC(12,2) DEFAULT 0,
  discount         NUMERIC(12,2) DEFAULT 0,
  tax              NUMERIC(12,2) DEFAULT 0,
  total            NUMERIC(12,2) DEFAULT 0,
  voucher_code     TEXT,
  status           TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'preparing', 'shipping', 'delivered', 'cancelled')),
  estimated_time   TEXT,
  driver           JSONB,
  order_type       TEXT DEFAULT 'delivery',
  table_number     TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. BẢNG CHI TIẾT ĐƠN HÀNG (order_items) ────────────────
CREATE TABLE public.order_items (
  id                BIGSERIAL PRIMARY KEY,
  order_id          TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  food_id           TEXT,
  food_name         TEXT,
  quantity          INTEGER DEFAULT 1,
  unit_price        NUMERIC(12,2) DEFAULT 0,
  total_price       NUMERIC(12,2) DEFAULT 0,
  selected_size     TEXT,
  selected_toppings JSONB DEFAULT '[]'
);

-- ── 6. BẢNG ĐÁNH GIÁ (reviews) ─────────────────────────────
CREATE TABLE public.reviews (
  id           BIGSERIAL PRIMARY KEY,
  user_id      TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  user_name    TEXT NOT NULL,
  user_email   TEXT,
  user_phone   TEXT,
  user_avatar  TEXT,
  rating       NUMERIC(2,1) NOT NULL DEFAULT 5,
  comment      TEXT NOT NULL,
  food_id      TEXT,
  food_name    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. CẤU HÌNH Row Level Security (RLS) ────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ── Policies: users ──────────────────────────────────────────
CREATE POLICY "anon_insert_users" ON public.users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_users" ON public.users FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_users" ON public.users FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ── Policies: reservations ───────────────────────────────────
CREATE POLICY "anon_insert_reservations" ON public.reservations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_reservations" ON public.reservations FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_reservations" ON public.reservations FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ── Policies: table_sessions ─────────────────────────────────
CREATE POLICY "anon_insert_table_sessions" ON public.table_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_table_sessions" ON public.table_sessions FOR SELECT TO anon USING (true);

-- ── Policies: orders ─────────────────────────────────────────
CREATE POLICY "anon_insert_orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_orders" ON public.orders FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_orders" ON public.orders FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ── Policies: order_items ────────────────────────────────────
CREATE POLICY "anon_insert_order_items" ON public.order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_order_items" ON public.order_items FOR SELECT TO anon USING (true);

-- ── Policies: reviews ────────────────────────────────────────
CREATE POLICY "anon_insert_reviews" ON public.reviews FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_reviews" ON public.reviews FOR SELECT TO anon USING (true);

-- ── 8. TỰ ĐỘNG GÁN QUYỀN ADMIN CHO huynhvuanhkhoa1601@gmail.com ──────
CREATE OR REPLACE FUNCTION public.set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(TRIM(NEW.email)) = 'huynhvuanhkhoa1601@gmail.com' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_admin_role ON public.users;
CREATE TRIGGER trg_set_admin_role
BEFORE INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_admin_role();

-- ── 9. INDEX ĐỂ TĂNG TỐC TÌM KIẾM ─────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name  ON public.orders (customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_user_id        ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at     ON public.orders (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_phone    ON public.reservations (phone);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id  ON public.reservations (user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date     ON public.reservations (date);

CREATE INDEX IF NOT EXISTS idx_table_sessions_code   ON public.table_sessions (table_code);
CREATE INDEX IF NOT EXISTS idx_table_sessions_created ON public.table_sessions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id       ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_food_id       ON public.reviews (food_id);

-- ── 10. VIEW TIỆN LỢI ĐỂ XEM BÁO CÁO ───────────────────────
-- View: Đơn hàng kèm thông tin đầy đủ
CREATE OR REPLACE VIEW public.orders_full AS
SELECT
  o.*,
  u.name AS user_display_name,
  u.role AS user_role,
  COUNT(oi.id)::INT AS item_count
FROM public.orders o
LEFT JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.name, u.role;

-- View: Đặt bàn kèm thông tin khách hàng
CREATE OR REPLACE VIEW public.reservations_full AS
SELECT
  r.*,
  u.email AS user_email_ref,
  u.role  AS user_role
FROM public.reservations r
LEFT JOIN public.users u ON r.user_id = u.id;
