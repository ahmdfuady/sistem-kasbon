import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { ensureWarung, getWarung } from '../../api';
import type { Warung } from '../../lib/types';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  warung: Warung | null;
  loading: boolean;
  recovery: boolean;
  setRecovery: (v: boolean) => void;
  refreshWarung: () => Promise<void>;
  setWarung: (w: Warung) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// "Ingat saya": kalau dimatikan, sesi hanya berlaku selama tab/browser terbuka
export const REMEMBER_KEY = 'kasbonku_remember';
const SESSION_MARK = 'kasbonku_active';
export const setRememberPref = (remember: boolean) => {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
    sessionStorage.setItem(SESSION_MARK, '1');
  } catch {
    /* abaikan */
  }
};
export const getRememberPref = (): boolean => {
  try {
    return localStorage.getItem(REMEMBER_KEY) !== '0';
  } catch {
    return true;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [warung, setWarung] = useState<Warung | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);

  const loadWarung = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setWarung(null);
      return;
    }
    try {
      let w = await getWarung(userId);
      if (!w) {
        // akun lama yang belum punya baris warung -> buatkan otomatis
        const { data } = await supabase.auth.getUser();
        const meta = (data.user?.user_metadata ?? {}) as Record<string, string>;
        w = await ensureWarung(userId, meta);
      }
      setWarung(w);
    } catch (e) {
      console.error('Gagal memuat data warung:', e);
      setWarung(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      // Pengguna memilih tidak diingat & browser sudah ditutup -> keluarkan
      try {
        if (data.session && localStorage.getItem(REMEMBER_KEY) === '0' && !sessionStorage.getItem(SESSION_MARK)) {
          await supabase.auth.signOut();
          setSession(null);
          setLoading(false);
          return;
        }
      } catch {
        /* abaikan */
      }
      setSession(data.session);
      await loadWarung(data.session?.user.id);
      if (active) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      // Ganti akun: jangan sisakan data warung milik akun sebelumnya
      setWarung((prev) => (prev && prev.id === newSession?.user.id ? prev : null));
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (event === 'SIGNED_OUT') {
        setWarung(null);
        setRecovery(false);
      }
      // Jangan await query Supabase langsung di dalam callback ini (bisa deadlock) -> tunda dengan setTimeout
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setTimeout(() => loadWarung(newSession?.user.id), 0);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadWarung]);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    warung,
    loading,
    recovery,
    setRecovery,
    refreshWarung: () => loadWarung(session?.user.id),
    setWarung,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
