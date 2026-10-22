import React from 'react';
import { BookOpen, Lock, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  /** dipanggil saat logo KasbonKu di navbar diklik (biasanya kembali ke beranda/login) */
  onLogoClick?: () => void;
  children: React.ReactNode;
}

/** Kerangka bersama halaman Login, Daftar, Lupa Sandi: navbar atas + isi + footer */
export default function AuthLayout({ onLogoClick, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f3f7f5] flex flex-col justify-between font-sans text-slate-800">

      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">KasbonKu</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Warung
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Catatan Kasbon & Piutang Warung</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100/80 border border-slate-200/60 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Aman & Terpercaya</span>
        </div>
      </header>

      {children}

      {/* Footer Bottom */}
      <footer className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/60 bg-white/50">
        <div className="flex items-center gap-1.5 mb-2 sm:mb-0">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Data tersimpan aman di server awan Indonesia</span>
        </div>
        <p>© 2024 KasbonKu. Sahabat Pembukuan Warung Kelontong Nusantara.</p>
      </footer>

    </div>
  );
}
