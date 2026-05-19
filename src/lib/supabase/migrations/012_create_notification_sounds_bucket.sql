-- ========================================================
-- Migration: Create Notification Sounds Storage Bucket
-- Date: 2026-05-19
-- ========================================================

-- 1. Create the notification-sounds bucket if it doesn't exist (no MIME restrictions)
INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
VALUES ('notification-sounds', 'notification-sounds', true, NULL)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "notification_sounds: public read" ON storage.objects;
DROP POLICY IF EXISTS "notification_sounds: auth insert" ON storage.objects;
DROP POLICY IF EXISTS "notification_sounds: auth update" ON storage.objects;
DROP POLICY IF EXISTS "notification_sounds: auth delete" ON storage.objects;

-- 3. Anyone can view/play notification sounds
CREATE POLICY "notification_sounds: public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'notification-sounds');

-- 4. Authenticated users can upload sounds
CREATE POLICY "notification_sounds: auth insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'notification-sounds');

-- 5. Authenticated users can update sounds
CREATE POLICY "notification_sounds: auth update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'notification-sounds');

-- 6. Authenticated users can delete sounds
CREATE POLICY "notification_sounds: auth delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'notification-sounds');
