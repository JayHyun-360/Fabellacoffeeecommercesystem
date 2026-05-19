import { createClient } from './client';
import type { AppRole, Profile } from './database.types';
import type { Session, User } from '@supabase/supabase-js';

// ─── Role extraction ──────────────────────────────────────────────────────────
// CIRCUIT BREAKER: Role is always read from JWT metadata — NEVER from a profiles
// table query inside an RLS policy, which causes infinite recursion and 5-second hangs.

export function getRoleFromSession(session: Session | null): AppRole {
  if (!session) return 'customer';
  const role = (session.user.app_metadata?.role || session.user.user_metadata?.role) as AppRole | undefined;
  return role ?? 'customer';
}

export function getRoleFromUser(user: User | null): AppRole {
  if (!user) return 'customer';
  const role = (user.app_metadata?.role || user.user_metadata?.role) as AppRole | undefined;
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

export async function signInAnonymously() {
  const supabase = createClient();
  return supabase.auth.signInAnonymously();
}

export async function linkGoogleIdentity() {
  const supabase = createClient();
  return supabase.auth.linkIdentity({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/` },
  });
}

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// ─── Profile helpers (admin) ─────────────────────────────────────────────────

export async function fetchAllProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function updateProfileRole(userId: string, role: AppRole) {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  if (error) throw error;
}

// ─── Role guards ──────────────────────────────────────────────────────────────

export function isAdmin(role: AppRole): boolean {
  return role === 'admin';
}

export function isStaff(role: AppRole): boolean {
  return role === 'staff' || role === 'admin';
}

export function isCustomer(role: AppRole): boolean {
  return true;
}
