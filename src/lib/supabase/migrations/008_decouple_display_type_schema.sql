-- Migration 008: Decouple Product display_type
-- Separates structural catalog definitions (regular vs. set) from marketing flags (promo, featured)

-- 1. Add marketing boolean flags
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_promo BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Migrate existing data to the new flags
-- Migrate 'featured' display_type to is_featured = TRUE, and reset type to 'regular'
UPDATE public.products
SET is_featured = TRUE, display_type = 'regular'
WHERE display_type = 'featured';

-- Migrate 'promo' display_type to is_promo = TRUE, and reset type to 'regular'
UPDATE public.products
SET is_promo = TRUE, display_type = 'regular'
WHERE display_type = 'promo';

-- products with display_type = 'set' remain display_type = 'set' (as combos/bundles)
-- products with display_type = 'regular' remain display_type = 'regular' (as standalone single products)

-- 3. Update the display_type check constraint (optional/recommended if your previous setup used checks)
-- This ensures display_type can only contain 'regular' or 'set' structurally moving forward
ALTER TABLE public.products
DROP CONSTRAINT IF EXISTS products_display_type_check;

ALTER TABLE public.products
ADD CONSTRAINT products_display_type_check 
CHECK (display_type IN ('regular', 'set'));

-- 4. Enable real-time updates for these new columns if needed (Supabase replication)
ALTER publication supabase_realtime ADD TABLE public.products;
