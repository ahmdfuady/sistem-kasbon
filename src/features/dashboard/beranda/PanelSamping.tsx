import type { BarangHasil } from '../../../lib/analytics';
import { formatRupiah } from '../../../lib/utils';

const BAR_COLORS = ['bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'];

interface PanelSampingProps {
  barang: BarangHasil;
  namaPemilik: string;
  plafonDefault?: number | null;
}

/** Kolom kanan bawah: "Barang Sering Dikasbon" + kartu tips */
export default function PanelSamping({ barang, namaPemilik, plafonDefault }: PanelSampingProps) {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700">📦</span>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Barang Sering Dikasbon</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Bulan Ini</span>
        </div>

        <div className="space-y-3 text-xs">
          {barang.items.length === 0 && <p className="text-center text-slate-400 py-3">Belum ada data barang bulan ini.</p>}
          {barang.items.map((b, i) => {
            const pct = barang.totalJumlah ? Math.round((b.jumlah / barang.totalJumlah) * 100) : 0;
            return (
              <div key={b.nama}>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span className="truncate pr-2">{b.nama}</span>
                  <span className="text-slate-900 font-extrabold">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${BAR_COLORS[i % BAR_COLORS.length]} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#064e3b] to-[#043d2e] text-white rounded-2xl p-5 space-y-3 shadow-md">
        <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
          <span>💡 Tips {namaPemilik} Pekan Ini</span>
        </div>
        <h4 className="font-extrabold text-sm sm:text-base leading-snug">
          {plafonDefault
            ? `Plafon Kasbon Maksimal ${formatRupiah(plafonDefault)} per Warga`
            : 'Tetapkan Plafon Kasbon per Warga'}
        </h4>
        <p className="text-[11px] text-emerald-100/90 leading-relaxed">
          Jangan ragu menahan kasbon baru bila tagihan minggu lalu belum dilunasi minimal 50%. Catatan rapi bikin warung panjang umur!
        </p>
      </div>
    </div>
  );
}
