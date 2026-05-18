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

-- 3. Admins can upload images (Insert)
CREATE POLICY "product_images: admin insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND (auth.jwt() ->> 'role') = 'admin'
  );

-- 4. Admins can update images
CREATE POLICY "product_images: admin update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND (auth.jwt() ->> 'role') = 'admin'
  );

-- 5. Admins can delete images
CREATE POLICY "product_images: admin delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND (auth.jwt() ->> 'role') = 'admin'
  );

-- 6. (Optional) Reset the hero slides to an empty array so you can add fresh image uploads
-- UPDATE public.store_settings
-- SET hero_slides = '[]'::jsonb;
