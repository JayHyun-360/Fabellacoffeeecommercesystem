-- ==========================================
-- Migration: Fix JWT Role Check paths
-- Date: 2026-05-18
-- ==========================================

-- The original JWT rules were checking the root "role" claim (which always defaults to 'authenticated' or 'anon').
-- The custom role was actually stamped into "user_metadata.role". 
-- We need to drop the faulty policies and recreate them with the correct path: (auth.jwt() -> 'user_metadata' ->> 'role')

-- 1. Fix Profiles table
DROP POLICY IF EXISTS "profiles: admin select all" ON public.profiles;
CREATE POLICY "profiles: admin select all" ON public.profiles
  FOR SELECT USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "profiles: admin update role" ON public.profiles;
CREATE POLICY "profiles: admin update role" ON public.profiles
  FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- 2. Fix Products table
DROP POLICY IF EXISTS "products: staff read all" ON public.products;
CREATE POLICY "products: staff read all" ON public.products
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );

DROP POLICY IF EXISTS "products: admin write" ON public.products;
CREATE POLICY "products: admin write" ON public.products
  FOR ALL USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');


-- 3. Fix Orders table
DROP POLICY IF EXISTS "orders: staff select all" ON public.orders;
CREATE POLICY "orders: staff select all" ON public.orders
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );

DROP POLICY IF EXISTS "orders: staff update status" ON public.orders;
CREATE POLICY "orders: staff update status" ON public.orders
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );


-- 4. Fix Order Items table
DROP POLICY IF EXISTS "order_items: staff select all" ON public.order_items;
CREATE POLICY "order_items: staff select all" ON public.order_items
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('staff', 'admin')
  );
