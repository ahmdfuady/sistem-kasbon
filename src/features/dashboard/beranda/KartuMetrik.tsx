import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, Wallet, CheckCircle, Bell } from 'lucide-react';
import { formatRupiah } from '../../../lib/utils';

interface KartuMetrikProps {
  isLoading: boolean;
  piutang: number;
  /** perubahan piutang dibanding minggu lalu (%), null = belum ada pembanding */
  perubahan: number | null;
  pelangganAktif: number;
  jumlahTagihan: number;
  totalTagihan: number;
  kasMasukMinggu: number;
  jumlahBayarMinggu: number;
  lancar: number;
}

/** 4 kartu ringkasan di Beranda */
export default function KartuMetrik({
  isLoading, piutang, perubahan, pelangganAktif, jumlahTagihan, totalTagihan, kasMasukMinggu, jumlahBayarMinggu, lancar,
}: KartuMetrikProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400">Total Piutang Berjalan</p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(piutang)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Wallet className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {perubahan === null ? (
            <span className="text-slate-400 text-[11px]">Belum ada pembanding</span>
          ) : (
            <span className={`${perubahan > 0 ? 'text-rose-600' : 'text-emerald-600'} font-bold text-[11px] flex items-center gap-0.5`}>
              {perubahan > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {perubahan > 0 ? '+' : ''}{perubahan}% <span className="text-slate-400 font-normal">vs minggu lalu</span>
            </span>
          )}
          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{pelangganAktif} Pelanggan</span>
        </div>
      </div>

      <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-bold"><AlertCircle className="w-3.5 h-3.5" /><span>Jatuh Tempo</span></div>
            <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">{jumlahTagihan} Orang</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center"><Bell className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs">
          <span className="text-rose-700 font-bold text-[11px]">Total: {formatRupiah(totalTagihan)}</span>
          {jumlahTagihan > 0 && <span className="bg-rose-200/70 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-md">Prioritas</span>}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400">Kas Masuk Minggu Ini</p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(kasMasukMinggu)}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">{jumlahBayarMinggu} transaksi lunas/cicil</span>
          {jumlahBayarMinggu > 0 && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">✓ Tertib</span>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400">Kelancaran Bayar</p>
            <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{lancar}%</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${lancar}%` }}></div>
          </div>
          <p className="text-[10px] text-slate-400">Pelanggan tertib tepat waktu</p>
        </div>
      </div>
    </div>
  );
}
