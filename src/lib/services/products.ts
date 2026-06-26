// Service layer for product operations.
// Currently re-exports AppContext shapes so pages don't need to change.
// When Supabase is connected, swap the implementations below with
// supabase.from('products').select/insert/update/delete calls.

import { supabase } from '@/lib/supabase/client';
import type { Product, ProductCategory } from '@/lib/supabase/database.types';

export type { Product, ProductCategory };

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name');

  if (error) throw error;
  return data ?? [];
}

export async function fetchProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('available', true)
    .order('name');

  if (error) throw error;
  return data ?? [];
}

// ─── Write (admin only) ───────────────────────────────────────────────────────

export async function createProduct(
  payload: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(
  id: string,
  payload: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleProductAvailability(
  id: string,
  available: boolean
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ available })
    .eq('id', id);
  if (error) throw error;
}
