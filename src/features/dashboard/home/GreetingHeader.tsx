import { Download } from 'lucide-react';
import { formatTanggalPanjang } from '../../../lib/utils';

interface GreetingHeaderProps {
  namaPemilik: string;
  namaWarung: string;
  onOpenRecord: (id?: string, jenis?: 'kasbon' | 'cicilan') => void;
  onGoLaporan: () => void;
}

/** Tanggal, sapaan "Halo, ...", dan tombol aksi cepat */
export default function GreetingHeader({ namaPemilik, namaWarung, onOpenRecord, onGoLaporan }: GreetingHeaderProps) {
  const now = new Date();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
          <span>🗓️ {formatTanggalPanjang(now)}</span>
          <span>•</span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Toko Buka • {now.getHours() < 11 ? 'Sesi Pagi' : now.getHours() < 15 ? 'Sesi Siang' : now.getHours() < 18 ? 'Sesi Sore' : 'Sesi Malam'}
          </span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">Halo, {namaPemilik} 👋</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ringkasan kasbon & piutang harian <span className="font-bold text-slate-700">{namaWarung}</span> terdata rapi hari ini.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onOpenRecord(undefined, 'kasbon')} className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
          <span>+ Catat Utang Baru</span>
        </button>
        <button onClick={() => onOpenRecord(undefined, 'cicilan')} className="bg-[#05603a] hover:bg-[#044e2f] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
          <span>+ Terima Bayar / Cicilan</span>
        </button>
        <button onClick={() => onGoLaporan()} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer">
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Laporan</span>
        </button>
      </div>
    </div>
  );
}
