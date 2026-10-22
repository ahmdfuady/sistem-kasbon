
import React from 'react';

interface NavbarProps {
  onStartFree?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartFree }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-600/30">
            K
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Kasbon<span className="text-emerald-600">Ku</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a href="#masalah" className="hover:text-emerald-600 transition">Kenapa KasbonKu</a>
          <a href="#fitur" className="hover:text-emerald-600 transition">Fitur Warung</a>
          <a href="#simulasi" className="hover:text-emerald-600 transition">Simulasi</a>
          <a href="#cara-kerja" className="hover:text-emerald-600 transition">Cara Pakai</a>
          <a href="#testimoni" className="hover:text-emerald-600 transition">Testimoni</a>
          <a href="#faq" className="hover:text-emerald-600 transition">Tanya Jawab</a>
        </nav>

        <button 
          onClick={onStartFree}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition shadow-sm hover:shadow-md cursor-pointer"
        >
          Mulai Gratis
        </button>
      </div>
    </header>
  );
};