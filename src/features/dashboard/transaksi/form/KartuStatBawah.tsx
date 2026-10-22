import React from 'react';
import { formatRupiah } from '../../../../lib/utils';

interface KartuStatBawahProps {
  beredar: number;
  setoranHariIni: number;
  tempoMinggu: number;
}

/** 3 kartu ringkasan di bawah form */
export default function KartuStatBawah({ beredar, setoranHariIni, tempoMinggu }: KartuStatBawahProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base">📈</div>
        <div>
          <p className="text-[10px] font-bold text-slate-400">Total Kasbon Beredar Hari Ini</p>
          <p className="text-base font-black text-slate-900 mt-0.5">{formatRupiah(beredar)}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">💵</div>
        <div>
          <p className="text-[10px] font-bold text-slate-400">Setoran Masuk Hari Ini</p>
          <p className="text-base font-black text-slate-900 mt-0.5">{formatRupiah(setoranHariIni)}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-base">👥</div>
        <div>
          <p className="text-[10px] font-bold text-slate-400">Pelanggan Jatuh Tempo Minggu Ini</p>
          <p className="text-base font-black text-slate-900 mt-0.5">{tempoMinggu} Orang</p>
        </div>
      </div>
    </div>
  );
}
