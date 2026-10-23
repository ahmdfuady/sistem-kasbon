import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Download, Trash2 } from 'lucide-react';
import type { Pelanggan, Transaksi } from '../../../../lib/types';
import { formatRupiah, formatTanggal, formatWaktu, labelMetode } from '../../../../lib/utils';
import type { StatusKasbon } from './historyAnalysis';

interface TransactionHistoryProps {
  pelanggan: Pelanggan;
  transaksiList: Transaksi[];
  statusKasbon: StatusKasbon;
  saldoMap: Map<string, { sebelum: number; sesudah: number }>;
  onDownloadPdf: () => void;
  onDeleteTransaksi: (t: Transaksi) => void;
}

/** Daftar riwayat kasbon & cicilan pelanggan, dengan filter Semua / Kasbon / Cicilan */
export default function TransactionHistory({
  pelanggan, transaksiList, statusKasbon, saldoMap, onDownloadPdf, onDeleteTransaksi,
}: TransactionHistoryProps) {
  const [filterTab, setFilterTab] = useState<'semua' | 'kasbon' | 'cicilan'>('semua');
  const tampil = transaksiList.filter((t) => filterTab === 'semua' || t.jenis === filterTab);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Riwayat Transaksi Lengkap</h3>
            <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full">{transaksiList.length} Catatan</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Buku catatan rincian hutang dan cicilan {pelanggan.nama}</p>
        </div>

        <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
          {([['semua', 'Semua'], ['kasbon', 'Kasbon Baru'], ['cicilan', 'Cicilan / Bayar']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilterTab(id)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterTab === id ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {tampil.length === 0 && (
          <p className="py-8 text-center text-xs text-slate-400">Belum ada riwayat transaksi untuk pelanggan ini.</p>
        )}

        {tampil.map((t, idx) => {
          const isKasbon = t.jenis === 'kasbon';
          const st = statusKasbon.get(t.id);
          const sisaSetelah = saldoMap.get(t.id)?.sesudah ?? 0;
          const lewatTempo = isKasbon && st && st.sisa > 0 && !!t.jatuh_tempo && t.jatuh_tempo < new Date().toLocaleDateString('en-CA');
          return (
            <div
              key={t.id}
              className={`group p-4 rounded-xl border bg-white transition flex items-start justify-between gap-4 ${
                idx === 0 ? (isKasbon ? 'border-rose-100 hover:border-rose-200' : 'border-emerald-100 hover:border-emerald-200') : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isKasbon ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {isKasbon ? <ArrowUpRight className="w-4 h-4 stroke-[2.5]" /> : <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-x-2">
                    <span className="font-extrabold text-xs text-slate-900">{isKasbon ? 'Kasbon Baru' : 'Cicilan Masuk'}</span>
                    <span className="text-[11px] text-slate-400">• {formatWaktu(t.created_at)}</span>
                  </div>

                  {isKasbon && st && (
                    st.sisa <= 0 ? (
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">✓ Lunas</span>
                    ) : st.terbayar > 0 ? (
                      <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">Sebagian Lunas (Tersisa {formatRupiah(st.sisa)})</span>
                    ) : (
                      <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-100">
                        ⏱️ Belum Lunas{t.jatuh_tempo ? ` (Tempo ${formatTanggal(t.jatuh_tempo)})` : ''}{lewatTempo ? ' • Lewat' : ''}
                      </span>
                    )
                  )}
                  {!isKasbon && (
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                      ✓ Diterima ({labelMetode(t.metode_bayar)})
                    </span>
                  )}

                  <p className="text-xs font-bold text-slate-800 break-words">{(isKasbon ? t.barang : t.catatan) || (isKasbon ? 'Tanpa rincian barang' : 'Pembayaran kasbon')}</p>
                  {isKasbon && t.catatan && <p className="text-[11px] text-slate-400 italic">↳ Catatan: {t.catatan}</p>}
                  {!isKasbon && t.no_kwitansi && (
                    <p className="text-[11px] text-slate-400 font-mono">🧾 Kwitansi No: #{t.no_kwitansi} • {labelMetode(t.metode_bayar)} {formatRupiah(t.nominal)}</p>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`text-sm font-black ${isKasbon ? 'text-rose-600' : 'text-emerald-600'}`}>{isKasbon ? '+' : '-'}{formatRupiah(t.nominal)}</p>
                <p className="text-[10px] text-slate-400">Sisa: {formatRupiah(Math.max(sisaSetelah, 0))}</p>
                <button onClick={() => onDeleteTransaksi(t)} title="Hapus catatan ini" className="mt-1 text-slate-300 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5 inline" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Menampilkan {tampil.length} dari total {transaksiList.length} transaksi</span>
        <button onClick={onDownloadPdf} className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer">
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Salinan PDF</span>
        </button>
      </div>
    </div>
  );
}