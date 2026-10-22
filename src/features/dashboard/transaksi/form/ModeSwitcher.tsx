import React from 'react';

interface ModeSwitcherProps {
  transactionType: 'kasbon' | 'cicilan';
  onChange: (t: 'kasbon' | 'cicilan') => void;
}

/** Tombol pilih jenis catatan: kasbon baru atau terima bayar/cicilan */
export default function ModeSwitcher({ transactionType, onChange }: ModeSwitcherProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center max-w-md w-full shadow-inner">
        <button
          type="button"
          onClick={() => onChange('kasbon')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${transactionType === 'kasbon' ? 'bg-rose-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <span>📕 + Utang / Kasbon Baru</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('cicilan')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${transactionType === 'cicilan' ? 'bg-[#05603a] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <span>💵 Terima Bayar / Cicilan</span>
        </button>
      </div>
    </div>
  );
}
