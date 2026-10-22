import React from 'react';
import { Calendar, Check, Clock } from 'lucide-react';
import type { TempoOption } from '../../../../lib/types';
import { formatTanggalHari, hitungJatuhTempo, labelMetode } from '../../../../lib/utils';

interface JatuhTempoAtauMetodeProps {
  transactionType: 'kasbon' | 'cicilan';
  tanggal: string;
  tempoOption: TempoOption;
  onTempoOptionChange: (v: TempoOption) => void;
  kalenderDate: string;
  onKalenderDateChange: (v: string) => void;
  metode: 'tunai' | 'transfer' | 'qris';
  onMetodeChange: (v: 'tunai' | 'transfer' | 'qris') => void;
}

/** Langkah 4: janji jatuh tempo (untuk kasbon) atau metode pembayaran (untuk cicilan) */
export default function JatuhTempoAtauMetode({
  transactionType, tanggal, tempoOption, onTempoOptionChange, kalenderDate, onKalenderDateChange, metode, onMetodeChange,
}: JatuhTempoAtauMetodeProps) {
  const baseDate = new Date(tanggal + 'T12:00:00');

  const opsiTempo: { id: TempoOption; label: string; sub: string; icon: any }[] = [
    { id: '3hari', label: '3 Hari Lagi', sub: formatTanggalHari(hitungJatuhTempo('3hari', undefined, baseDate)), icon: Clock },
    { id: '1minggu', label: '1 Minggu Lagi', sub: formatTanggalHari(hitungJatuhTempo('1minggu', undefined, baseDate)), icon: Calendar },
    { id: 'gajian', label: 'Saat Gajian / Akhir Bulan', sub: formatTanggalHari(hitungJatuhTempo('gajian', undefined, baseDate)), icon: Calendar },
    { id: 'kalender', label: 'Pilih Kalender', sub: kalenderDate ? formatTanggalHari(kalenderDate) : 'Tentukan tanggal sendiri', icon: Calendar },
  ];

  return (
    transactionType === 'kasbon' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-extrabold text-slate-800">Janji Kapan Mau Dibayar? (Jatuh Tempo)</label>
                    <span className="text-[11px] text-emerald-700 font-bold">Biar aman ditagih</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {opsiTempo.map((opt) => {
                      const aktif = tempoOption === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => onTempoOptionChange(opt.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                            aktif ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 text-xs">
                            <opt.icon className={`w-4 h-4 ${aktif ? 'text-white' : 'text-slate-400'}`} />
                            <div>
                              <p className={`font-bold ${aktif ? '' : 'text-slate-800'}`}>{opt.label}</p>
                              <p className={`text-[10px] ${aktif ? 'text-emerald-200' : 'text-slate-400'}`}>{opt.sub}</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${aktif ? 'border-white bg-white text-emerald-800' : 'border-slate-300'}`}>
                            {aktif && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {tempoOption === 'kalender' && (
                    <input
                      type="date"
                      value={kalenderDate}
                      min={tanggal}
                      onChange={(e) => onKalenderDateChange(e.target.value)}
                      className="mt-2.5 w-full sm:w-auto text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-xs font-extrabold text-slate-800 block mb-2">Metode Pembayaran</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(['tunai', 'transfer', 'qris'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => onMetodeChange(m)}
                        className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${metode === m ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}
                      >
                        {m === 'tunai' ? '💵 ' : m === 'transfer' ? '🏦 ' : '📱 '}{labelMetode(m)}
                      </button>
                    ))}
                  </div>
                </div>
              )
  );
}
