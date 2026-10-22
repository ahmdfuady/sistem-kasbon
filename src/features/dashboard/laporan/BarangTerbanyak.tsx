import type { BarangHasil } from '../../../lib/analytics';
import { formatRupiah } from '../../../lib/utils';

interface BarangTerbanyakProps {
  barang: BarangHasil;
  labelPeriode: string;
  /** persen kasbon yang disumbang 2 barang teratas */
  top2Persen: number;
}

/** Komposisi barang yang paling sering dikasbon pada periode terpilih */
export default function BarangTerbanyak({ barang, labelPeriode, top2Persen }: BarangTerbanyakProps) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">Barang Kasbon Terbanyak</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Komposisi barang yang paling sering ditangguhkan pembayarannya ({labelPeriode}).</p>
        </div>
        <span className="text-slate-400 text-lg">📦</span>
      </div>

      <div className="space-y-3.5 text-xs">
        {barang.items.length === 0 && <p className="text-center text-slate-400 py-4">Belum ada rincian barang pada periode ini.</p>}
        {barang.items.map((b, i) => {
          const pct = barang.totalJumlah ? Math.round((b.jumlah / barang.totalJumlah) * 100) : 0;
          const warna = i < 3 ? 'bg-emerald-600' : 'bg-slate-400';
          return (
            <div key={b.nama}>
              <div className="flex justify-between font-bold text-slate-700 mb-1 gap-2">
                <span className="flex items-center gap-2 min-w-0"><span className={`w-2 h-2 rounded-full shrink-0 ${warna}`}></span><span className="truncate">{b.nama}</span></span>
                <span className="shrink-0">{formatRupiah(b.nominal)} <strong className="text-slate-900 ml-1">{pct}%</strong></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`${warna} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {barang.items.length >= 2 && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
          <span className="text-emerald-700">💡</span>
          <span><strong>Perhatian Juragan:</strong> {barang.items[0].nama} dan {barang.items[1].nama} menyumbang {top2Persen}% kasbon. Pastikan pembeli melunasi sebelum mengambil barang yang sama berikutnya.</span>
        </div>
      )}
    </div>
  );
}
