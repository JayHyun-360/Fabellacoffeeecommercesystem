-- Migration: 010_enable_realtime_orders.sql
-- Description: Enables Supabase Realtime for the orders table so the Staff and Admin panels receive instant notifications.

-- 1. Ensure the publication exists (Supabase creates this by default, but it's safe to verify)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- 2. Add the orders table to the realtime publication
-- (If it's already added, this will throw a benign notice, but to be clean we just try to add it)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN duplicate_object THEN
    -- Do nothing if it's already in the publication
  END;
END $$;
