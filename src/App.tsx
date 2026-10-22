import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './features/auth/AuthContext';
import LandingPage from './features/landing/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import ResetPassword from './features/auth/ResetPassword';
import Dashboard from './features/dashboard/Dashboard';

type PublicView = 'landing' | 'login' | 'register' | 'forgot';

/**
 * URL tanpa anchor landing (#masalah, #fitur, #cara-kerja, dst).
 * Hash yang berisi "=" (mis. #access_token=...&type=recovery dari email reset sandi)
 * sengaja TIDAK dianggap anchor supaya proses reset sandi Supabase tidak rusak.
 */
const urlTanpaAnchor = (): string => {
  const { pathname, search, hash } = window.location;
  const anchorBiasa = hash.length > 1 && !hash.includes('=');
  return anchorBiasa ? pathname + search : pathname + search + hash;
};

export default function App() {
  const { session, loading, recovery } = useAuth();
  // Halaman pertama SELALU landing page. Login/Daftar/Lupa sandi hanya dibuka lewat tombol.
  const [view, setViewState] = useState<PublicView>('landing');

  const setView = useCallback((v: PublicView) => {
    setViewState(v);
    window.history.pushState({ kasbonku: v }, '', urlTanpaAnchor());
    window.scrollTo(0, 0);
  }, []);

  // Tombol Back/Forward browser ikut berpindah antar halaman publik
  useEffect(() => {
    window.history.replaceState({ kasbonku: 'landing' }, '');
    const onPop = (e: PopStateEvent) => setViewState((e.state?.kasbonku as PublicView) ?? 'landing');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Sudah login -> buang anchor landing dari URL
  useEffect(() => {
    if (session) window.history.replaceState(window.history.state, '', urlTanpaAnchor());
  }, [!!session]);

  // Setelah logout (tidak ada sesi) -> kembali ke landing page
  useEffect(() => {
    if (!loading && !session) setViewState((v) => (v === 'landing' ? v : 'landing'));
    // hanya bereaksi saat status sesi berubah
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!session]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f7f5] text-slate-500 text-sm font-medium">
        Memuat KasbonKu...
      </div>
    );
  }

  // Dari link "reset password" di email
  if (recovery && session) return <ResetPassword />;

  // Sudah login -> Dashboard (data dari Supabase)
  if (session) return <Dashboard key={session.user.id} />;

  switch (view) {
    case 'login':
      return (
        <Login
          onBackToHome={() => setView('landing')}
          onNavigateToRegister={() => setView('register')}
          onForgotPassword={() => setView('forgot')}
        />
      );
    case 'register':
      return <Register onBackToLogin={() => setView('login')} onBackToHome={() => setView('landing')} />;
    case 'forgot':
      return <ForgotPassword onBackToLogin={() => setView('login')} onBackToHome={() => setView('landing')} />;
    default:
      return <LandingPage onStartFree={() => setView('login')} />;
  }
}