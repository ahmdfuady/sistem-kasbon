import { X } from 'lucide-react';
import { formatAngkaInput, formatRupiah, parseAngka } from '../../../../lib/utils';

interface AmountInputProps {
  transactionType: 'kasbon' | 'cicilan';
  nominal: number;
  onNominalChange: (n: number) => void;
  utangSebelumnya: number;
}

/** Langkah 2: nominal + tombol tambah cepat + "Lunasi Semua" */
export default function AmountInput({ transactionType, nominal, onNominalChange, utangSebelumnya }: AmountInputProps) {
  const addNominal = (amount: number) => onNominalChange(nominal + amount);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-extrabold text-slate-800">Nominal {transactionType === 'kasbon' ? 'Kasbon Baru' : 'Pembayaran'} <span className="text-rose-500">*</span></label>
        <span className="text-[11px] text-slate-400">Pastikan hitungan warung pas</span>
      </div>

      <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 focus-within:bg-white transition">
        <span className="text-xl sm:text-2xl font-black text-slate-900 mr-2">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={nominal ? formatAngkaInput(nominal) : ''}
          onChange={(e) => onNominalChange(parseAngka(e.target.value))}
          className={`w-full bg-transparent text-xl sm:text-2xl font-black ${transactionType === 'kasbon' ? 'text-rose-600' : 'text-emerald-700'} focus:outline-none tracking-tight`}
        />
        {nominal > 0 && (
          <button type="button" onClick={() => onNominalChange(0)} className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
        <span className="text-[11px] text-slate-400 mr-1 font-medium">Tambah Cepat:</span>
        {[5000, 10000, 20000, 50000, 100000, 200000].map((amt) => (
          <button key={amt} type="button" onClick={() => addNominal(amt)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer">
            +Rp {amt.toLocaleString('id-ID')}
          </button>
        ))}
        {transactionType === 'cicilan' && utangSebelumnya > 0 && (
          <button type="button" onClick={() => onNominalChange(utangSebelumnya)} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer">
            Lunasi Semua ({formatRupiah(utangSebelumnya)})
          </button>
        )}
      </div>
    </div>
  );
}
