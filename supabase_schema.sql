-- ============================================================
-- 🗄️ SUPABASE SCHEMA - KenRestaurant Database
-- Chạy toàn bộ script này trong Supabase SQL Editor
-- ============================================================

-- ── 1. BẢNG NGƯỜI DÙNG (users) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name         TEXT NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  phone        TEXT,
  address      TEXT,
  role         TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  avatar       TEXT,
  verified     BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. BẢNG ĐẶT BÀN (reservations) ────────────────────────
CREATE TABLE IF NOT EXISTS public.reservations (
  id            BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone         TEXT NOT NULL,
  guests        INTEGER NOT NULL DEFAULT 2,
  date          TEXT NOT NULL,
  time          TEXT NOT NULL,
  table_type    TEXT,
  notes         TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. BẢNG ĐƠN HÀNG (orders) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               TEXT PRIMARY KEY,
  customer_name    TEXT,
  customer_phone   TEXT,
  customer_address TEXT,
  payment_method   TEXT DEFAULT 'cod',
  notes            TEXT,
  subtotal         NUMERIC(12,2) DEFAULT 0,
  delivery_fee     NUMERIC(12,2) DEFAULT 0,
  discount         NUMERIC(12,2) DEFAULT 0,
  tax              NUMERIC(12,2) DEFAULT 0,
  total            NUMERIC(12,2) DEFAULT 0,
  voucher_code     TEXT,
  status           TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'preparing', 'shipping', 'delivered', 'cancelled')),
  estimated_time   TEXT,
  driver           JSONB,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. BẢNG CHI TIẾT ĐƠN HÀNG (order_items) ────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id               BIGSERIAL PRIMARY KEY,
  order_id         TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  food_id          TEXT,
  food_name        TEXT,
  quantity         INTEGER DEFAULT 1,
  unit_price       NUMERIC(12,2) DEFAULT 0,
  total_price      NUMERIC(12,2) DEFAULT 0,
  selected_size    TEXT,
  selected_toppings JSONB DEFAULT '[]'
);

-- ── 5. BẢNG ĐÁNH GIÁ (reviews) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id           BIGSERIAL PRIMARY KEY,
  user_name    TEXT NOT NULL,
  user_avatar  TEXT,
  rating       NUMERIC(2,1) NOT NULL DEFAULT 5,
  comment      TEXT NOT NULL,
  food_id      TEXT,
  food_name    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. CẤU HÌNH Row Level Security (RLS) ────────────────────
-- Bật RLS cho tất cả bảng
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Cho phép Anon key INSERT/SELECT vào tất cả bảng (frontend không auth)
CREATE POLICY "Allow anon insert users" ON public.users
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon insert reservations" ON public.reservations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon select reservations" ON public.reservations
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert orders" ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon select orders" ON public.orders
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert order_items" ON public.order_items
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon select order_items" ON public.order_items
  FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anon insert reviews" ON public.reviews
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anon select reviews" ON public.reviews
  FOR SELECT TO anon USING (true);

-- Cho phép update users (cho updateProfile)
CREATE POLICY "Allow anon update users" ON public.users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
