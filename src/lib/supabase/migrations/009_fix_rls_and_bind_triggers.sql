-- Migration 009: Fix RLS Policies and Bind Role Sync Trigger
-- Ensures all role policies use app_metadata and role updates are synced in real-time.

-- 1. Correctly bind the trigger on public.profiles to sync roles to auth.users in real time!
DROP TRIGGER IF EXISTS on_profile_role_updated ON public.profiles;
CREATE TRIGGER on_profile_role_updated
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_role_to_jwt();

-- 2. Update trigger function to sync BOTH app_metadata and user_metadata for safety and client-side instant updates!
CREATE OR REPLACE FUNCTION public.sync_role_to_jwt()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  -- Sync to raw_app_meta_data (Secure, Server-controlled)
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;

  -- Also sync to raw_user_meta_data to ensure client session receives the update instantly on next refresh/event
  UPDATE auth.users
  SET raw_user_meta_data =
    COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

-- 3. Re-secure PROFILES table with app_metadata
DROP POLICY IF EXISTS "profiles: admin select all" ON public.profiles;
CREATE POLICY "profiles: admin select all" ON public.profiles
  FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "profiles: admin update role" ON public.profiles;
CREATE POLICY "profiles: admin update role" ON public.profiles
  FOR UPDATE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 4. Re-secure PRODUCTS table with app_metadata
DROP POLICY IF EXISTS "products: staff read all" ON public.products;
CREATE POLICY "products: staff read all" ON public.products
  FOR SELECT USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'customer') IN ('staff', 'admin')
  );

DROP POLICY IF EXISTS "products: admin write" ON public.products;
CREATE POLICY "products: admin write" ON public.products
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- 5. Re-secure ORDERS table with app_metadata
DROP POLICY IF EXISTS "orders: staff select all" ON public.orders;
CREATE POLICY "orders: staff select all" ON public.orders
  FOR SELECT USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'customer') IN ('staff', 'admin')
  );

DROP POLICY IF EXISTS "orders: staff update status" ON public.orders;
CREATE POLICY "orders: staff update status" ON public.orders
  FOR UPDATE USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'customer') IN ('staff', 'admin')
  );

-- 6. Re-secure ORDER ITEMS table with app_metadata
DROP POLICY IF EXISTS "order_items: staff select all" ON public.order_items;
CREATE POLICY "order_items: staff select all" ON public.order_items
  FOR SELECT USING (
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', 'customer') IN ('staff', 'admin')
  );
