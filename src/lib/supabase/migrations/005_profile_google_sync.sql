-- ========================================================
-- Migration: Google Identity Linking and Profile Metadata Sync
-- Date: 2026-05-19
-- ========================================================

-- Create trigger function to automatically update profiles when auth.users metadata is updated
CREATE OR REPLACE FUNCTION public.handle_update_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  UPDATE public.profiles
  SET 
    email = NEW.email,
    full_name = NEW.raw_user_meta_data ->> 'full_name',
    avatar_url = NEW.raw_user_meta_data ->> 'avatar_url',
    is_anonymous = COALESCE(NEW.is_anonymous, FALSE)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

-- Bind the trigger to auth.users updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_update_user();
