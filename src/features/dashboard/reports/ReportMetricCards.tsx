import { Clock, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';
import { formatRupiah } from '../../../lib/utils';

interface ReportMetricCardsProps {
  isLoading: boolean;
  piutang: number;
  jumlahPelanggan: number;
  aktif: number;
  kasMasuk: number;
  /** perubahan kas masuk dibanding bulan sebelumnya (%), null = belum ada pembanding */
  perubahanKas: number | null;
  jumlahBayar: number;
  piutangTelat: number;
  jumlahTelat: number;
  lancarNominal: number;
  persenLancar: number;
}

/** 4 kartu ringkasan di atas laporan */
export default function ReportMetricCards({
  isLoading, piutang, jumlahPelanggan, aktif, kasMasuk, perubahanKas, jumlahBayar, piutangTelat, jumlahTelat, lancarNominal, persenLancar,
}: ReportMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">TOTAL KASBON BEREDAR</p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(piutang)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Wallet className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2 py-0.5 rounded">{jumlahPelanggan} Pelanggan</span>
          <span className="text-[11px] text-slate-400">{aktif} orang aktif ada kasbon</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">KAS PELUNASAN MASUK</p>
            <p className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(kasMasuk)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          {perubahanKas !== null && (
            <span className={`${perubahanKas >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'} font-extrabold text-[10px] px-2 py-0.5 rounded border`}>
              {perubahanKas >= 0 ? '↗ +' : '↘ '}{perubahanKas}%
            </span>
          )}
          <span className="text-[11px] text-slate-400">{jumlahBayar} kali cicil/lunas</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">JATUH TEMPO / TERTAHAN</p>
            <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(piutangTelat)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Clock className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          {jumlahTelat > 0 && <span className="bg-rose-50 text-rose-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-rose-200">Perlu Disapa</span>}
          <span className="text-[11px] text-slate-400">{jumlahTelat} warga nunggak</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">MODAL TERSELAMATKAN</p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(lancarNominal)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mr-2">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${persenLancar}%` }}></div>
            </div>
            <span className="text-emerald-700 whitespace-nowrap">{persenLancar}% Lancar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
