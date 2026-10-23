import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../../../lib/utils';
import { rb } from './helpers';

interface TitikArus {
  key: string;
  label: string;
  masuk: number;
  kasbon: number;
  isToday?: boolean;
}

interface CashFlowChartProps {
  arus: TitikArus[];
  /** nilai tertinggi sumbu Y */
  skala: number;
  /** total kas masuk dikurangi kasbon baru selama 7 hari */
  surplus: number;
}

/** Grafik batang kas masuk vs kasbon baru selama 7 hari terakhir */
export default function CashFlowChart({ arus, skala, surplus }: CashFlowChartProps) {
  return (
    <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">Arus Mutasi Kasbon 7 Hari Terakhir</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Perbandingan uang belanjaan kasbon keluar vs uang bayar cicilan masuk</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#064e3b]"></span> Kas Masuk</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-600"></span> Kasbon Baru</span>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <div className="relative h-44 flex items-end justify-between gap-2 px-2 text-[10px] font-bold text-slate-400">
          <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none text-[9px] text-slate-300">
            <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>{rb(skala)}</span></div>
            <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>{rb((skala * 2) / 3)}</span></div>
            <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>{rb(skala / 3)}</span></div>
            <div className="border-b border-slate-200 w-full flex justify-between"><span>0</span></div>
          </div>

          {arus.map((a) => (
            <div key={a.key} className="flex-1 flex flex-col items-center gap-1 z-10">
              <div className="w-full flex items-end justify-center gap-1 h-36">
                <div title={`Kas masuk ${formatRupiah(a.masuk)}`} className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm" style={{ height: `${a.masuk > 0 ? Math.max((a.masuk / skala) * 100, 2) : 0}%` }}></div>
                <div title={`Kasbon baru ${formatRupiah(a.kasbon)}`} className="w-3 sm:w-4 bg-rose-600 rounded-t-sm" style={{ height: `${a.kasbon > 0 ? Math.max((a.kasbon / skala) * 100, 2) : 0}%` }}></div>
              </div>
              <span className={a.isToday ? 'text-emerald-700 font-extrabold' : ''}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${surplus >= 0 ? 'bg-emerald-50/70 border-emerald-100' : 'bg-rose-50/70 border-rose-100'} border rounded-xl p-3 flex items-center justify-between text-xs gap-2`}>
        <div className="flex items-center gap-2 text-slate-700">
          {surplus >= 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>
            {surplus >= 0 ? 'Surplus Kas Pelunasan' : 'Kasbon Baru Melebihi Pelunasan'}:{' '}
            <strong className={`${surplus >= 0 ? 'text-emerald-800' : 'text-rose-700'} font-black`}>{surplus >= 0 ? '+' : '-'}{formatRupiah(Math.abs(surplus))}</strong>{' '}
            {surplus >= 0 ? 'lebih banyak daripada kasbon baru 7 hari ini.' : 'dibanding uang masuk 7 hari ini.'}
          </span>
        </div>
        <span className={`bg-white ${surplus >= 0 ? 'text-emerald-800 border-emerald-200' : 'text-rose-700 border-rose-200'} border text-[10px] font-black px-2 py-0.5 rounded-md uppercase whitespace-nowrap`}>
          {surplus >= 0 ? 'ARUS SEHAT' : 'WASPADA'}
        </span>
      </div>
    </div>
  );
}
