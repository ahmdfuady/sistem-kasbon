import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import KasbonKuLanding from './KasbonKuLanding';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Dashboard from './dashboard/Dashboard';

type PublicView = 'landing' | 'login' | 'register' | 'forgot';

export default function App() {
  const { session, loading, recovery } = useAuth();
  // Halaman pertama SELALU landing page. Login/Daftar/Lupa sandi hanya dibuka lewat tombol.
  const [view, setViewState] = useState<PublicView>('landing');

  const setView = useCallback((v: PublicView) => {
    setViewState(v);
    window.history.pushState({ kasbonku: v }, '');
    window.scrollTo(0, 0);
  }, []);

  // Tombol Back/Forward browser ikut berpindah antar halaman publik
  useEffect(() => {
    window.history.replaceState({ kasbonku: 'landing' }, '');
    const onPop = (e: PopStateEvent) => setViewState((e.state?.kasbonku as PublicView) ?? 'landing');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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
      return <KasbonKuLanding onStartFree={() => setView('login')} />;
  }
}
