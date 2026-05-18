import { createClient, isSupabaseConfigured } from './client';
import type { StoreSettings } from './database.types';

export async function fetchStoreSettingsFromDb(): Promise<StoreSettings | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  
  // Use maybeSingle to avoid 406 errors if the table is empty
  const { data, error } = await (supabase as any)
    .from('store_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching store settings:', error);
    throw error;
  }
  
  return data as StoreSettings | null;
}

export async function updateStoreSettingsInDb(updates: Partial<Omit<StoreSettings, 'id' | 'updated_at'>>): Promise<StoreSettings> {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured');
  const supabase = createClient();
  
  // Try to get the existing settings row ID first
  const { data: existing, error: existingError } = await (supabase as any)
    .from('store_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking existing store settings:', existingError);
    throw existingError;
  }

  if (existing) {
    const { data, error } = await (supabase as any)
      .from('store_settings')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as StoreSettings;
  } else {
    // If no row exists, insert one
    const { data, error } = await (supabase as any)
      .from('store_settings')
      .insert(updates)
      .select()
      .single();
    if (error) throw error;
    return data as StoreSettings;
  }
}
