import { Keyboard } from 'lucide-react';

/** Judul halaman "Pencatatan Transaksi" + lencana Mode Kasir */
export default function CashierHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/60 gap-3">
      <div>
        <p className="text-[11px] font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
          <span>🏪 KASIR & KASBON WARUNG</span>
          <span>•</span>
          <span className="text-slate-400 font-semibold">BUKU CATATAN DIGITAL</span>
        </p>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">Pencatatan Transaksi Kasbon & Pembayaran</h1>
        <p className="text-xs text-slate-500 mt-0.5">Catat transaksi belanja kasbon baru pelanggan atau terima setoran cicilan dengan cepat dan teratur.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-white border border-slate-200 text-slate-600 text-[11px] font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
          <Keyboard className="w-3.5 h-3.5 text-slate-400" />
          <span>Tekan <strong className="font-mono text-slate-800">Enter</strong> untuk simpan</span>
        </div>
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Mode Kasir Aktif</span>
        </div>
      </div>
    </div>
  );
}
