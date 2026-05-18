-- ========================================================
-- Migration: Add delivery_fee to store_settings
-- Date: 2026-05-19
-- ========================================================

ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 49.00;
