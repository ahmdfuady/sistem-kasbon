
import React from 'react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section id="cara-kerja" className="py-16 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Langkah Mudah</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-12">
          Cuma Butuh 3 Menit untuk Memulai
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">1</div>
            <h4 className="font-bold text-slate-900 mb-2">Daftar Akun Warung</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Cukup masukkan nama warung & nomor WhatsApp Anda. Langsung aktif tanpa syarat kartu kredit.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">2</div>
            <h4 className="font-bold text-slate-900 mb-2">Catat Kasbon Pertama</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Ketik nama tetangga yang belanja dan nominal barang belanjaannya dalam 5 detik.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">3</div>
            <h4 className="font-bold text-slate-900 mb-2">Kirim Nota & Tagih Ramah</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Kirim pengingat atau bukti nota belanja santun lewat 1 kali klik ke chat WhatsApp tetangga.</p>
          </div>
        </div>
      </div>
    </section>
  );
};