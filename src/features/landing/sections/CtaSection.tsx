import React from 'react';

interface CtaSectionProps {
  onStartFree?: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartFree }) => {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl shadow-emerald-700/20">
          <h2 className="text-2xl sm:text-4xl font-black max-w-2xl mx-auto leading-tight">
            Siap Bikin Pembukuan Warung Lebih Tertib & Rezeki Makin Lancar?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
            Bergabunglah dengan ribuan pemilik warung dan kelontong di seluruh Indonesia yang telah beralih dari buku kertas ke KasbonKu.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button 
              onClick={onStartFree}
              className="bg-white hover:bg-slate-100 text-emerald-800 font-bold px-7 py-3 rounded-xl transition text-xs sm:text-sm shadow-md cursor-pointer"
            >
              Coba Demo Tanpa Daftar
            </button>
            <button 
              onClick={onStartFree}
              className="bg-emerald-950/60 hover:bg-emerald-950 text-white font-bold px-7 py-3 rounded-xl border border-emerald-400/30 transition text-xs sm:text-sm cursor-pointer"
            >
              Mulai Pakai KasbonKu Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};