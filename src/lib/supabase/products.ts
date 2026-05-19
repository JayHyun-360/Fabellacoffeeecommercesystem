import { createClient, isSupabaseConfigured } from './client';
import type { Product, DisplayType, ProductCategory, SetItem } from './database.types';

// ─── Fetch ───────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Product[];
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createProductInDb(product: {
  name: string;
  description: string;
  price: number;
  promo_price?: number | null;
  category: ProductCategory;
  display_type: DisplayType;
  image: string;
  available: boolean;
  set_items?: SetItem[] | null;
  is_featured?: boolean;
  is_promo?: boolean;
}): Promise<Product> {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .insert({
      name: product.name,
      description: product.description,
      price: product.price,
      promo_price: product.promo_price ?? null,
      category: product.category,
      display_type: product.display_type,
      image: product.image,
      available: product.available,
      set_items: product.set_items ?? null,
      is_featured: product.is_featured ?? false,
      is_promo: product.is_promo ?? false,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateProductInDb(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    price: number;
    promo_price: number | null;
    category: ProductCategory;
    display_type: DisplayType;
    image: string;
    available: boolean;
    set_items: SetItem[] | null;
    is_featured: boolean;
    is_promo: boolean;
  }>
): Promise<Product> {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteProductFromDb(id: string): Promise<void> {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ─── Toggle Availability ─────────────────────────────────────────────────────

export async function toggleProductAvailabilityInDb(
  id: string,
  available: boolean
): Promise<void> {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .update({ available })
    .eq('id', id);
  if (error) throw error;
}

// ─── Image Upload ────────────────────────────────────────────────────────────

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(path);

  return data.publicUrl;
}
