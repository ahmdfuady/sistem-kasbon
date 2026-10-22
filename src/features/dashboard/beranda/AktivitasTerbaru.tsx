import type { Transaksi } from '../../../lib/types';
import { formatRupiah, formatWaktuRelatif, initials } from '../../../lib/utils';

interface AktivitasTerbaruProps {
  /** transaksi terbaru yang akan ditampilkan */
  recentTrans: Transaksi[];
  /** saldo berjalan per transaksi (untuk menandai "Lunas") */
  saldoMap: Map<string, { sebelum: number; sesudah: number }>;
  isLoading: boolean;
}

/** Tabel "Aktivitas Transaksi Terbaru" */
export default function AktivitasTerbaru({ recentTrans, saldoMap, isLoading }: AktivitasTerbaruProps) {
  return (
    <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700">⏱️</span>
          <h3 className="font-extrabold text-sm text-slate-900">Aktivitas Transaksi Terbaru</h3>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">Update Otomatis</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold">
              <th className="pb-3 font-semibold">Pelanggan</th>
              <th className="pb-3 font-semibold">Rincian Barang</th>
              <th className="pb-3 font-semibold">Waktu</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {recentTrans.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-slate-400">{isLoading ? 'Memuat data...' : 'Belum ada transaksi'}</td></tr>
            )}
            {recentTrans.map((t) => {
              const sesudah = saldoMap.get(t.id)?.sesudah ?? 1;
              const lunas = t.jenis === 'cicilan' && sesudah <= 0;
              return (
                <tr key={t.id}>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full font-bold text-[10px] flex items-center justify-center ${t.jenis === 'cicilan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                        {initials(t.pelanggan?.nama ?? '?')}
                      </div>
                      <span className="font-bold text-slate-800">{t.pelanggan?.nama}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600 truncate max-w-[180px]">{t.barang || t.catatan || '-'}</td>
                  <td className="py-3.5 text-slate-400 text-[11px]">{formatWaktuRelatif(t.created_at)}</td>
                  <td className="py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.jenis === 'cicilan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                      {t.jenis === 'cicilan' ? (lunas ? '✓ Lunas' : 'Cicilan Masuk') : 'Kasbon Baru'}
                    </span>
                  </td>
                  <td className={`py-3.5 text-right font-extrabold ${t.jenis === 'cicilan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.jenis === 'cicilan' ? '+' : '-'}{formatRupiah(t.nominal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
