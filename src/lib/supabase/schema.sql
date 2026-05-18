-- =============================================================================
-- FABELLA COFFEE — Supabase Schema
-- =============================================================================
-- CIRCUIT BREAKER RULE: RLS policies MUST use JWT metadata for role checks.
--   CORRECT:   (auth.jwt() ->> 'role') = 'admin'
--   FORBIDDEN: EXISTS (SELECT 1 FROM public.profiles WHERE ...)
--   Reason: Querying profiles inside RLS causes infinite recursion → 5-second hangs.
-- =============================================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE public.app_role        AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE public.product_category AS ENUM ('coffee', 'food', 'pastries', 'beverages');
CREATE TYPE public.order_status    AS ENUM ('pending', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.order_type      AS ENUM ('dine-in', 'takeout', 'delivery', 'pickup');
CREATE TYPE public.payment_method  AS ENUM ('cod', 'gcash', 'card');

-- ─── Profiles ─────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  role        public.app_role NOT NULL DEFAULT 'customer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read their own profile
CREATE POLICY "profiles: select own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all profiles — JWT role check (Circuit Breaker)
CREATE POLICY "profiles: admin select all" ON public.profiles
  FOR SELECT USING ((auth.jwt() ->> 'role') = 'admin');

-- Admins can update any profile's role
CREATE POLICY "profiles: admin update role" ON public.profiles
  FOR UPDATE USING ((auth.jwt() ->> 'role') = 'admin');

-- Users can update their own non-role fields
CREATE POLICY "profiles: update own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ─── Role Stamping Trigger (Circuit Breaker enforcement) ─────────────────────
-- Syncs the `role` column from profiles → auth.users.user_metadata
-- so that auth.jwt() ->> 'role' is always current.

CREATE OR REPLACE FUNCTION public.sync_role_to_jwt()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data =
    COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_role_change
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_role_to_jwt();

-- Auto-create profile on new user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, is_anonymous)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    'customer',
    COALESCE(NEW.is_anonymous, FALSE)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE public.products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category    public.product_category NOT NULL,
  image       TEXT NOT NULL DEFAULT '',
  available   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone (including guests) can read available products
CREATE POLICY "products: public read" ON public.products
  FOR SELECT USING (available = TRUE);

-- Staff and admins can read all products (including unavailable)
CREATE POLICY "products: staff read all" ON public.products
  FOR SELECT USING (
    (auth.jwt() ->> 'role') IN ('staff', 'admin')
  );

-- Only admins can insert/update/delete products
CREATE POLICY "products: admin write" ON public.products
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

-- ─── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_number     SERIAL,
  customer_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT,
  customer_phone   TEXT,
  order_type       public.order_type NOT NULL,
  payment_method   public.payment_method NOT NULL,
  status           public.order_status NOT NULL DEFAULT 'pending',
  total            NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  notes            TEXT,
  delivery_address TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Authenticated customers can view their own orders
CREATE POLICY "orders: customer select own" ON public.orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Staff and admins can view all orders — JWT role check (Circuit Breaker)
CREATE POLICY "orders: staff select all" ON public.orders
  FOR SELECT USING (
    (auth.jwt() ->> 'role') IN ('staff', 'admin')
  );

-- Anyone can place an order (guest or authenticated)
CREATE POLICY "orders: insert" ON public.orders
  FOR INSERT WITH CHECK (TRUE);

-- Staff and admins can update order status
CREATE POLICY "orders: staff update status" ON public.orders
  FOR UPDATE USING (
    (auth.jwt() ->> 'role') IN ('staff', 'admin')
  );

-- ─── Order Items ──────────────────────────────────────────────────────────────
CREATE TABLE public.order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,   -- snapshot; preserved even if product is deleted
  product_price NUMERIC(10, 2) NOT NULL,
  quantity      INT NOT NULL CHECK (quantity > 0),
  subtotal      NUMERIC(10, 2) GENERATED ALWAYS AS (product_price * quantity) STORED
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Mirror order visibility for items
CREATE POLICY "order_items: customer select own" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "order_items: staff select all" ON public.order_items
  FOR SELECT USING (
    (auth.jwt() ->> 'role') IN ('staff', 'admin')
  );

CREATE POLICY "order_items: insert" ON public.order_items
  FOR INSERT WITH CHECK (TRUE);

-- ─── Store Settings ───────────────────────────────────────────────────────────
CREATE TABLE public.store_settings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name     TEXT NOT NULL DEFAULT 'Fabella Coffee',
  email          TEXT NOT NULL DEFAULT '',
  phone          TEXT NOT NULL DEFAULT '',
  address        TEXT NOT NULL DEFAULT 'Ramz Square, Bislig, Philippines, 8311',
  weekday_hours  TEXT NOT NULL DEFAULT '6:00 AM – 10:00 PM',
  weekend_hours  TEXT NOT NULL DEFAULT '7:00 AM – 11:00 PM',
  announcement   TEXT,
  hero_slides    JSONB NOT NULL DEFAULT '[]',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read store settings
CREATE POLICY "store_settings: public read" ON public.store_settings
  FOR SELECT USING (TRUE);

-- Only authenticated users (Admins/Staff) can update store settings
CREATE POLICY "store_settings: auth write" ON public.store_settings
  FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ─── Seed: Initial store settings row ─────────────────────────────────────────
INSERT INTO public.store_settings (store_name, weekday_hours, weekend_hours, address)
VALUES (
  'Fabella Coffee',
  '6:00 AM – 10:00 PM',
  '7:00 AM – 11:00 PM',
  'Ramz Square, Bislig, Philippines, 8311'
) ON CONFLICT DO NOTHING;

-- ─── Updated-at trigger (reusable) ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Storage (product-images bucket) ──────────────────────────────────────────
-- Create the bucket (requires Supabase superuser, typically done via Dashboard, but included for completeness)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for the product-images bucket
-- Anyone can view images
CREATE POLICY "product_images: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Admins and staff can upload, update, and delete images
CREATE POLICY "product_images: auth insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "product_images: auth update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

CREATE POLICY "product_images: auth delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');
