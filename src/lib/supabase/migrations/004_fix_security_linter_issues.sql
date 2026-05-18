-- ==========================================
-- Migration: Fix Critical Security Issues (App Metadata)
-- Date: 2026-05-18
-- ==========================================

-- Supabase strictly warns against using `user_metadata` for RLS because users can update it themselves via the Auth API.
-- We are migrating to `app_metadata`, which is read-only for users and strictly controlled by the server.

-- 1. Update the role sync trigger to use `raw_app_meta_data`
CREATE OR REPLACE FUNCTION public.sync_role_to_jwt()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data =
    COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- 2. Migrate existing users' roles from user_metadata to app_metadata so no one loses their admin/staff status
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', raw_user_meta_data->>'role')
WHERE raw_user_meta_data->>'role' IS NOT NULL;


-- 3. Re-secure `store_settings` using the secure `app_metadata`
DROP POLICY IF EXISTS "store_settings: auth write" ON public.store_settings;
CREATE POLICY "store_settings: staff write" ON public.store_settings
  FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff'));


-- 4. Re-secure `storage.objects` to prevent Anonymous users from uploading/deleting images
DROP POLICY IF EXISTS "product_images: auth insert" ON storage.objects;
DROP POLICY IF EXISTS "product_images: auth update" ON storage.objects;
DROP POLICY IF EXISTS "product_images: auth delete" ON storage.objects;

CREATE POLICY "product_images: staff insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff')
  );

CREATE POLICY "product_images: staff update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff')
  );

CREATE POLICY "product_images: staff delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff')
  );
