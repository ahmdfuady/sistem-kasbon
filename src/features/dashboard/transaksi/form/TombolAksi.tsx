import React from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface TombolAksiProps {
  transactionType: 'kasbon' | 'cicilan';
  isSaving: boolean;
  onBack: () => void;
  onReset: () => void;
}

/** Tombol bawah form: Batal, Reset, dan Simpan */
export default function TombolAksi({ transactionType, isSaving, onBack, onReset }: TombolAksiProps) {
  return (
    <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onBack} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer">
          <span>← Batal / Kembali</span>
        </button>
        <button type="button" onClick={onReset} title="Reset Form" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition cursor-pointer">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        type="submit"
        disabled={isSaving}
        className="w-full sm:w-auto bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-60 text-white font-black px-8 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>{isSaving ? 'Menyimpan...' : transactionType === 'kasbon' ? 'Simpan Catatan Kasbon (Enter)' : 'Simpan Pembayaran (Enter)'}</span>
      </button>
    </div>
  );
}
