-- ========================================================
-- Migration: Add Notification Sound Column to store_settings
-- Date: 2026-05-19
-- ========================================================

-- 1. Add notification_sound_url column to store_settings
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS notification_sound_url TEXT;

-- 2. Allow public access to read objects in product-images (which handles both products and assets like custom sound mp3s)
-- The product-images bucket already has public read, but this is a reminder.
