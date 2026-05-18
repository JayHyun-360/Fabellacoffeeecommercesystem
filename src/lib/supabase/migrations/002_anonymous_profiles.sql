-- ==========================================
-- Migration: Anonymous Profiles Support
-- Date: 2026-05-18
-- ==========================================

-- 1. Make email nullable since anonymous users don't have one
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;

-- 2. Add is_anonymous column to track guest status
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Update the handle_new_user trigger function to safely insert anonymous users
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
