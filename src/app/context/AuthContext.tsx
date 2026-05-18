'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';
import {
  getRoleFromSession,
  signInWithGoogle,
  signInWithGitHub,
  signOut as _signOut,
} from '../../lib/supabase/auth';
import type { AppRole } from '../../lib/supabase/database.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  session: Session | null;
  user: User | null;
  role: AppRole;
  isLoading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

interface AuthActions {
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

type AuthContextValue = AuthState & AuthActions;

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Boot: load existing session (no-op when Supabase credentials are not set)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const role: AppRole = getRoleFromSession(session);
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff' || role === 'admin';

  const loginWithGoogle = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const loginWithGitHub = useCallback(async () => {
    await signInWithGitHub();
  }, []);

  const logout = useCallback(async () => {
    await _signOut();
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    role,
    isLoading,
    isAdmin,
    isStaff,
    loginWithGoogle,
    loginWithGitHub,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
