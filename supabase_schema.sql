-- ============================================================
-- 🗄️ SUPABASE SCHEMA - KenRestaurant Database
-- ⚠️ XÓA BẢNG CŨ VÀ TẠO LẠI TỪ ĐẦU
-- Chạy toàn bộ script này trong Supabase SQL Editor
-- ============================================================

-- ── XÓA BẢNG CŨ (nếu có) ───────────────────────────────────
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ── 1. BẢNG NGƯỜI DÙNG (users) ─────────────────────────────
CREATE TABLE public.users (
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
CREATE TABLE public.reservations (
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
CREATE TABLE public.orders (
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
CREATE TABLE public.order_items (
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
CREATE TABLE public.reviews (
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
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Cho phép Anon key INSERT/SELECT/UPDATE
CREATE POLICY "anon_insert_users" ON public.users FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_users" ON public.users FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_users" ON public.users FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_insert_reservations" ON public.reservations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_reservations" ON public.reservations FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_orders" ON public.orders FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_order_items" ON public.order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_order_items" ON public.order_items FOR SELECT TO anon USING (true);

CREATE POLICY "anon_insert_reviews" ON public.reviews FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_reviews" ON public.reviews FOR SELECT TO anon USING (true);

-- ── 7. TỰ ĐỘNG GÁN QUYỀN ADMIN CHO huynhvuanhkhoa1601@gmail.com ──────
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
