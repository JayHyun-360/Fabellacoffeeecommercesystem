import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  'https://placeholder.supabase.co';
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  'placeholder-anon-key';

export const isSupabaseConfigured =
  supabaseUrl !== 'https://placeholder.supabase.co';

// Single browser client — reuse this everywhere; never instantiate a new one per request.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
