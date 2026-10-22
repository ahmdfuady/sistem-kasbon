
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">K</div>
            <span className="text-base font-bold text-white">KasbonKu</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Aplikasi pencatatan kasbon dan piutang khusus pemilik warung tradisional dan kelontong modern di Indonesia.
          </p>
        </div>

        <div>
          <h5 className="text-white font-bold mb-3">Fitur Utama</h5>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Quick Kasbon 5 Detik</a></li>
            <li><a href="#" className="hover:text-white transition">Pengingat WhatsApp Sopan</a></li>
            <li><a href="#" className="hover:text-white transition">Batas Limit Piutang</a></li>
            <li><a href="#" className="hover:text-white transition">Rekap Mingguan Warung</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold mb-3">Bantuan & Komunitas</h5>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Panduan Pemula</a></li>
            <li><a href="#" className="hover:text-white transition">Komunitas Juragan Warung</a></li>
            <li><a href="#" className="hover:text-white transition">Hubungi Bantuan CS</a></li>
            <li><a href="#" className="hover:text-white transition">Kebijakan Privasi</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold mb-3">Dukungan</h5>
          <p className="leading-relaxed mb-3">Butuh panduan instalasi atau setting warung Anda?</p>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-2">
            <span>💬 Chat WhatsApp CS</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 pt-6 border-t border-slate-800 text-center text-slate-500">
        © 2026 KasbonKu Indonesia. Hak cipta dilindungi undang-undang.
      </div>
    </footer>
  );
};