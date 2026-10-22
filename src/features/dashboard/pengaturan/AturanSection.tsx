import React from 'react';
import { Clock } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { toggleCls } from './styles';
import type { Plafon } from './plafon';

interface AturanSectionProps {
  sectionRef: React.Ref<HTMLDivElement>;
  plafonOption: Plafon;
  onPlafonChange: (v: Plafon) => void;
  lockKasbon: boolean;
  onLockChange: (v: boolean) => void;
}

/** 2. Aturan & plafon kasbon default */
export default function AturanSection({ sectionRef, plafonOption, onPlafonChange, lockKasbon, onLockChange }: AturanSectionProps) {
  const { warung } = useAuth();

  return (
    <div ref={sectionRef} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-24">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">📊</div>
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">2. Aturan & Plafon Kasbon Warga</h3>
          <p className="text-[11px] text-slate-400">Kendalikan perputaran uang modal dagangan warung agar tidak macet.</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-800 mb-2">Batas Maksimal Kasbon Default per Warga Baru</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {([
            ['100', 'Aman Pemula', 'Rp 100.000', 'Bagi warga pendatang'],
            ['200', 'Standar Warung', 'Rp 200.000', 'Cukup untuk sembako pekanan'],
            ['500', 'Warga Tetangga Akrab', 'Rp 500.000', 'Untuk langganan bertahun-tahun'],
            ['unlimited', 'Bebas Catat', 'Tanpa Batas', 'Tidak disarankan'],
          ] as const).map(([id, judul, nilai, sub]) => (
            <div
              key={id}
              onClick={() => onPlafonChange(id)}
              className={`p-3 rounded-xl border cursor-pointer transition text-left relative ${
                plafonOption === id ? `border-emerald-600 bg-emerald-50/40 ${id === '200' ? 'ring-2 ring-emerald-600/30' : 'ring-1 ring-emerald-500/20'}` : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {id === '200' && (
                <span className="absolute -top-2 right-2 bg-emerald-700 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">★ REKOMENDASI</span>
              )}
              <p className={`text-[10px] font-bold ${id === '200' ? 'text-emerald-800' : 'text-slate-400'}`}>{judul}</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{nilai}</p>
              <p className={`text-[9px] mt-1 ${id === 'unlimited' ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>{sub}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Plafon default dipakai untuk pelanggan baru dan pelanggan yang belum punya batas sendiri. Batas per pelanggan bisa diubah di buku pelanggan.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Jadwal Pengingat Jatuh Tempo</label>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span className="font-extrabold text-slate-800">7 Hari / 1 Minggu (Sangat Dianjurkan)</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Sistem akan memberi tanda warna merah bila melewati tanggal ini.</p>
        </div>

        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div>
            <p className="text-xs font-bold text-slate-800">Kunci Pencatatan Kasbon Baru</p>
            <p className="text-[10px] text-slate-400 leading-snug mt-0.5 max-w-xs">Jika warga memiliki tunggakan lewat jatuh tempo lebih dari 7 hari, tombol tambah utang akan terkunci secara aman.</p>
            <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ Mencegah {warung?.nama_pemilik || 'pemilik'} sungkan menolak tatap muka</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer ml-3">
            <input type="checkbox" checked={lockKasbon} onChange={(e) => onLockChange(e.target.checked)} className="sr-only peer" />
            <div className={toggleCls}></div>
          </label>
        </div>
      </div>
    </div>
  );
}
