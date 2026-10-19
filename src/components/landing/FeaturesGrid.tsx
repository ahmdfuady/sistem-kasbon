import React from 'react';
import { Zap, MessageSquare, ShieldCheck, DollarSign, Smartphone } from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="fitur" className="py-20 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Fitur Dirancang Untuk Warung</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Dirancang Khusus untuk Jam Sibuk Warung
          </h2>
          <p className="text-sm text-slate-500 mt-3">
            Tidak perlu pusing menu ribet. Dibuat seringkas dan secepat mungkin untuk pedagang warung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Catat Kasbon 5 Detik</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cukup pilih nama pelanggan, ketik nominal atau pilih barang cepat, klik simpan tanpa hambatan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Pengingat Santun WhatsApp</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format pesan disusun sopan dan bernada kekeluargaan agar pelanggan membayar tanpa tersinggung.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Pasang Batas Kasbon</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Atur limit kasbon per orang. Sistem memberi tanda peringatan ramah saat batas limit hampir tercapai.
            </p>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Rekap Mingguan & Laporan Kasbon Otomatis</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Lihat berapa uang warung yang masih di luar, tren pelunasan, dan pelanggan paling tertib setiap minggu.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="h-2 flex-1 bg-emerald-100 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[84%]"></div>
              </div>
              <span className="text-xs font-bold text-emerald-700">84% Kasbon Tertagih Tepat Waktu</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900">Bisa Diakses Mode Offline</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sinyal warung lemot? Kasbon tetap bisa dicatat dan akan tersinkron otomatis saat sinyal kembali normal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};