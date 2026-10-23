import React from 'react';
import { ChevronLeft, ChevronRight, Printer, Search } from 'lucide-react';
import type { Transaksi } from '../../../lib/types';
import { formatRupiah, formatTanggal, initials, jamWib } from '../../../lib/utils';
import { PER_HALAMAN, infoStatus } from './helpers';

export type TabLaporan = 'semua' | 'pelunasan' | 'kasbon';

interface SummaryTableProps {
  activeTab: TabLaporan;
  onTabChange: (t: TabLaporan) => void;
  hitungTab: Record<TabLaporan, number>;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onCetak: () => void;
  /** baris untuk halaman yang sedang dibuka */
  tampil: Transaksi[];
  /** jumlah seluruh baris setelah disaring */
  totalBaris: number;
  saldoMap: Map<string, { sebelum: number; sesudah: number }>;
  isLoading: boolean;
  periode: string;
  labelPeriode: string;
  halaman: number;
  totalHalaman: number;
  onHalamanChange: (h: number) => void;
}

/** Tabel rekap transaksi: tab, pencarian, daftar mutasi, dan nomor halaman */
export default function SummaryTable({
  activeTab, onTabChange, hitungTab, searchQuery, onSearchChange, onCetak, tampil, totalBaris, saldoMap,
  isLoading, periode, labelPeriode, halaman, totalHalaman, onHalamanChange,
}: SummaryTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600 overflow-x-auto">
          {([['semua', 'Semua Rekap Harian'], ['pelunasan', 'Pelunasan Masuk'], ['kasbon', 'Kasbon Baru']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${activeTab === id ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              {label} ({hitungTab[id]})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400"><Search className="w-3.5 h-3.5" /></span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Saring nama pelanggan..."
              className="bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>
          <button onClick={onCetak} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <th className="pb-3 font-semibold">WAKTU TRANSAKSI</th>
              <th className="pb-3 font-semibold">PELANGGAN & RINCIAN BELANJA</th>
              <th className="pb-3 font-semibold">JENIS MUTASI</th>
              <th className="pb-3 font-semibold">STATUS</th>
              <th className="pb-3 font-semibold text-right">KASBON BARU (-)</th>
              <th className="pb-3 font-semibold text-right">PELUNASAN MASUK (+)</th>
              <th className="pb-3 font-semibold text-right">SALDO KASBON BERJALAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {tampil.length === 0 && (
              <tr><td colSpan={7} className="py-8 text-center text-slate-400">{isLoading ? 'Memuat data...' : 'Belum ada data transaksi pada periode ini.'}</td></tr>
            )}
            {tampil.map((t) => {
              const isK = t.jenis === 'kasbon';
              const s = saldoMap.get(t.id);
              const st = infoStatus(t, saldoMap);
              const sisa = Math.max(s?.sesudah ?? 0, 0);
              return (
                <tr key={t.id}>
                  <td className="py-3.5">
                    <p className="font-bold text-slate-800">{formatTanggal(t.created_at)}</p>
                    <p className="text-[10px] text-slate-400">{jamWib(t.created_at)}</p>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${isK ? 'bg-rose-100 text-rose-700' : 'bg-emerald-800 text-white'}`}>{initials(t.pelanggan?.nama ?? '?')}</div>
                      <div>
                        <p className="font-bold text-slate-900">{t.pelanggan?.nama ?? 'Warga'}</p>
                        <p className="text-[10px] text-slate-400 max-w-[220px] truncate">{t.barang || t.catatan || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`${isK ? 'text-rose-600' : 'text-emerald-700'} font-bold flex items-center gap-1 whitespace-nowrap`}>
                      <span className={`w-2 h-2 rounded-full border-2 ${isK ? 'border-rose-600' : 'border-emerald-600'}`}></span> {isK ? 'Kasbon Baru' : 'Kas Masuk'}
                    </span>
                  </td>
                  <td className="py-3.5"><span className={`${st.warna} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>{st.teks}</span></td>
                  <td className={`py-3.5 text-right ${isK ? 'font-black text-rose-600' : 'text-slate-300'}`}>{isK ? `-${formatRupiah(t.nominal)}` : '-'}</td>
                  <td className={`py-3.5 text-right ${!isK ? 'font-black text-emerald-600' : 'text-slate-300'}`}>{!isK ? `+${formatRupiah(t.nominal)}` : '-'}</td>
                  <td className={`py-3.5 text-right font-bold ${sisa > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{!isK && sisa > 0 ? `Sisa ${formatRupiah(sisa)}` : formatRupiah(sisa)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <span>
          Menampilkan {totalBaris === 0 ? 0 : (halaman - 1) * PER_HALAMAN + 1}–{Math.min(halaman * PER_HALAMAN, totalBaris)} dari {totalBaris} mutasi kasbon {periode === 'semua' ? 'seluruh waktu' : labelPeriode}
        </span>
        <div className="flex items-center gap-1 font-bold text-slate-600">
          <button disabled={halaman <= 1} onClick={() => onHalamanChange(halaman - 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          {Array.from({ length: totalHalaman }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalHalaman || Math.abs(n - halaman) <= 1)
            .map((n, i, arr) => (
              <React.Fragment key={n}>
                {i > 0 && n - arr[i - 1] > 1 && <span className="px-1">…</span>}
                <button onClick={() => onHalamanChange(n)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${n === halaman ? 'bg-[#05603a] text-white shadow-sm' : 'border border-slate-200 hover:bg-slate-50'}`}>{n}</button>
              </React.Fragment>
            ))}
          <button disabled={halaman >= totalHalaman} onClick={() => onHalamanChange(halaman + 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
