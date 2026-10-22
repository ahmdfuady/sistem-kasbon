import { formatRupiah } from '../../../../lib/utils';
import type { BarangFavorit as BarangFavoritItem } from './analisisRiwayat';

/** 3 barang yang paling sering diambil pelanggan */
export default function BarangFavorit({ barangFavorit }: { barangFavorit: BarangFavoritItem[] }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700">📦</span>
          <h4 className="font-extrabold text-xs text-slate-900">Barang yang Sering Diambil</h4>
        </div>
        <span className="text-[10px] font-bold text-slate-400">3 Teratas</span>
      </div>

      <div className="space-y-2.5 text-xs">
        {barangFavorit.length === 0 && <p className="text-center text-slate-400 py-2">Belum ada rincian barang tercatat.</p>}
        {barangFavorit.map((b, i) => (
          <div key={b.nama} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-5 h-5 rounded-md font-extrabold text-[10px] flex items-center justify-center shrink-0 ${['bg-sky-100 text-sky-800', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-800'][i]}`}>{i + 1}</span>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 truncate">{b.nama}</p>
                <p className="text-[10px] text-slate-400">Frekuensi: {b.jumlah}x transaksi</p>
              </div>
            </div>
            <span className="font-bold text-slate-800 shrink-0">{formatRupiah(b.nominal / b.jumlah)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
