import { TrendingUp } from 'lucide-react';
import type { Pelanggan } from '../../../../lib/types';
import type { PolaKasbonInfo } from './analisisRiwayat';

/** Kartu kecil: kebiasaan membayar + grafik mini saldo utang */
export default function PolaKasbon({ pelanggan, pola }: { pelanggan: Pelanggan; pola: PolaKasbonInfo }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold"><TrendingUp className="w-5 h-5" /></div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">Pola Kasbon {pelanggan.nama}</h4>
          <p className="text-[11px] text-slate-400">{pola.teks}</p>
        </div>
      </div>
      <svg className="w-24 h-8 text-emerald-600 shrink-0" viewBox="0 0 100 30" fill="none">
        <path d={pola.path} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={pola.last.x} cy={pola.last.y} r="3" fill="#dc2626" />
      </svg>
    </div>
  );
}
