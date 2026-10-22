import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { todayISO } from '../../../../lib/utils';

interface PilihTanggalProps {
  tanggal: string;
  onTanggalChange: (v: string) => void;
}

/** Langkah 3: tanggal transaksi (default hari ini, bisa dicatat mundur) */
export default function PilihTanggal({ tanggal, onTanggalChange }: PilihTanggalProps) {
  const [showTanggal, setShowTanggal] = useState(false);

  return (
    <div>
      <label className="text-xs font-extrabold text-slate-800 block mb-2">Tanggal Transaksi</label>
      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <div>
            <p className="font-bold text-slate-900">
              {tanggal === todayISO() ? 'Hari ini, ' : ''}{new Date(tanggal + 'T12:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-[10px] text-slate-400">Waktu warung (WIB) • jam dicatat otomatis saat disimpan</p>
          </div>
        </div>
        {showTanggal ? (
          <input
            type="date"
            value={tanggal}
            max={todayISO()}
            onChange={(e) => { if (e.target.value) onTanggalChange(e.target.value); }}
            className="text-[11px] font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white"
          />
        ) : (
          <button type="button" onClick={() => setShowTanggal(true)} className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition cursor-pointer">
            Ubah Tanggal
          </button>
        )}
      </div>
    </div>
  );
}
