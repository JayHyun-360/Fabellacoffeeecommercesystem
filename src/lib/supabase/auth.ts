import { createClient } from './client';
import type { AppRole } from './database.types';
import type { Session, User } from '@supabase/supabase-js';

// ─── Role extraction ──────────────────────────────────────────────────────────
// CIRCUIT BREAKER: Role is always read from JWT metadata — NEVER from a profiles
// table query inside an RLS policy, which causes infinite recursion and 5-second hangs.

export function getRoleFromSession(session: Session | null): AppRole {
  if (!session) return 'customer';
  const role = session.user.user_metadata?.role as AppRole | undefined;
  return role ?? 'customer';
}

export function getRoleFromUser(user: User | null): AppRole {
  if (!user) return 'customer';
  const role = user.user_metadata?.role as AppRole | undefined;
  return role ?? 'customer';
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signInWithGoogle() {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/` },
  });
}

export async function signInWithGitHub() {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/` },
  });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// ─── Role guards ──────────────────────────────────────────────────────────────

export function isAdmin(role: AppRole): boolean {
  return role === 'admin';
}

export function isStaff(role: AppRole): boolean {
  return role === 'staff' || role === 'admin';
}

export function isCustomer(role: AppRole): boolean {
  return true; // all authenticated users can act as customers
}
