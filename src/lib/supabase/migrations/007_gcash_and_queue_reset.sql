-- ========================================================
-- Migration: Add GCash payment settings and Clear Active Orders RPC
-- Date: 2026-05-19
-- ========================================================

-- 1. Add GCash columns to store_settings
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS gcash_number TEXT NOT NULL DEFAULT '+63 917 123 4567';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS gcash_name TEXT NOT NULL DEFAULT 'Fabella Coffee';
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS gcash_qr_code TEXT;

-- 2. Create the secure RPC function to clear active orders and reset sequence
CREATE OR REPLACE FUNCTION public.clear_active_orders()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  -- Check if caller is admin
  IF (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' THEN
    RAISE EXCEPTION 'Only admins can clear active orders.';
  END IF;

  -- Delete all orders (cascade automatically deletes order_items)
  DELETE FROM public.orders;
  
  -- Restart the queue serial sequence
  ALTER SEQUENCE public.orders_queue_number_seq RESTART WITH 1;
END;
$$;
