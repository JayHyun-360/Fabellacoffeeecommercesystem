-- ==========================================
-- Migration: Hero Slides & Storage Policies
-- Date: 2026-05-18
-- ==========================================

-- 1. Create the product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Anyone can view images
CREATE POLICY "product_images: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Drop the restrictive policies just in case they were already created
DROP POLICY IF EXISTS "product_images: admin insert" ON storage.objects;
DROP POLICY IF EXISTS "product_images: admin update" ON storage.objects;
DROP POLICY IF EXISTS "product_images: admin delete" ON storage.objects;

-- 3. Authenticated users can upload images (Insert)
CREATE POLICY "product_images: auth insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

-- 4. Authenticated users can update images
CREATE POLICY "product_images: auth update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

-- 5. Authenticated users can delete images
CREATE POLICY "product_images: auth delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- 6. (Optional) Reset the hero slides to an empty array so you can add fresh image uploads
-- UPDATE public.store_settings
-- SET hero_slides = '[]'::jsonb;
