import { useState } from 'react';
import {
  Phone, MapPin, Calendar, PlusCircle, CheckCircle2, ExternalLink, Download,
  MoreHorizontal, Edit2, Lock, Check, Trash2,
} from 'lucide-react';
import type { Pelanggan, SaldoPelanggan } from '../../../../lib/types';
import { formatRupiah, formatTanggal, initials } from '../../../../lib/utils';

interface ProfileHeaderProps {
  pelanggan: Pelanggan;
  saldo: SaldoPelanggan;
  waLink: string;
  /** true bila kasbon baru dikunci (menunggak lebih dari 7 hari) */
  terkunci: boolean;
  onRecordTransaction?: (pelangganId: string, jenis: 'kasbon' | 'cicilan') => void;
  onDownloadPdf: () => void;
  pdfLoading: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

/** Kartu profil pelanggan: identitas, total sisa kasbon, progres bayar, dan tombol aksi */
export default function ProfileHeader({
  pelanggan, saldo, waLink, terkunci, onRecordTransaction, onDownloadPdf, pdfLoading, onEdit, onDelete,
}: ProfileHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const persenBayar = saldo.total_kasbon > 0 ? Math.round((saldo.total_bayar / saldo.total_kasbon) * 100) : 0;
  const telat = saldo.sisa_utang > 0 && saldo.hari_telat > 0;
  const sejak = new Date(pelanggan.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* Info Pelanggan */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-800 font-black text-xl flex items-center justify-center shrink-0">
              {initials(pelanggan.nama)}
            </div>
            {saldo.sisa_utang <= 0 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{pelanggan.nama}</h2>
              <span className="bg-slate-100 text-slate-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">ID: #{pelanggan.kode}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{pelanggan.whatsapp || 'Belum ada nomor WA'}</span>
              </span>
              {pelanggan.alamat && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{pelanggan.alamat}</span></span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>Pelanggan sejak {sejak}</span></span>
            </div>
          </div>
        </div>

        {/* Sisa Kasbon & Progress */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
          <div className={`${telat ? 'bg-rose-50/70 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'} border rounded-2xl p-4 min-w-[200px]`}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-500">TOTAL SISA KASBON</span>
              {telat && (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><span>🚨 Telat {saldo.hari_telat} Hari</span></span>
              )}
              {!telat && saldo.sisa_utang <= 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Lunas</span>
              )}
            </div>
            <p className={`text-2xl font-black ${saldo.sisa_utang > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatRupiah(saldo.sisa_utang)}</p>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <span>⏱️ Jatuh tempo: {saldo.sisa_utang > 0 ? formatTanggal(saldo.jatuh_tempo_terakhir) : '-'}</span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[200px]">
            <p className="text-[10px] font-bold text-slate-400">Total Seluruh Riwayat Kasbon</p>
            <p className="text-base font-extrabold text-slate-900 mt-0.5">{formatRupiah(saldo.total_kasbon)}</p>
            <div className="mt-2 space-y-1">
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(persenBayar, 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500">
                <span className="text-emerald-700 font-bold">Sudah Terbayar</span> {formatRupiah(saldo.total_bayar)} ({persenBayar}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => !terkunci && onRecordTransaction?.(saldo.pelanggan_id, 'kasbon')}
          disabled={terkunci}
          title={terkunci ? 'Dikunci: menunggak lebih dari 7 hari' : ''}
          className="bg-rose-700 hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          {terkunci ? <Lock className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{terkunci ? 'Kasbon Terkunci (Nunggak)' : '+ Catat Kasbon Baru'}</span>
        </button>

        <button onClick={() => onRecordTransaction?.(saldo.pelanggan_id, 'cicilan')} className="bg-[#05603a] hover:bg-[#044e2f] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
          <CheckCircle2 className="w-4 h-4" />
          <span>+ Terima Cicilan / Bayar</span>
        </button>

        <button onClick={() => window.open(waLink, '_blank')} className="bg-[#25d366] hover:bg-[#20ba59] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
          <ExternalLink className="w-4 h-4" />
          <span>Buka wa.me {pelanggan.nama}</span>
        </button>

        <button onClick={onDownloadPdf} disabled={pdfLoading} className="disabled:opacity-60 disabled:cursor-wait bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer">
          <Download className="w-4 h-4 text-slate-400" />
          <span>{pdfLoading ? 'Membuat PDF...' : 'Unduh Rincian Kasbon'}</span>
        </button>

        <div className="relative">
          <button onClick={() => setShowMenu((v) => !v)} className="w-9 h-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center transition cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute z-20 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg text-xs overflow-hidden">
                <button onClick={() => { setShowMenu(false); onEdit(); }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                  <Edit2 className="w-3.5 h-3.5" /> Ubah Data Pelanggan
                </button>
                <button onClick={() => { setShowMenu(false); onDelete(); }} className="w-full text-left px-3 py-2.5 hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2 border-t border-slate-100 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Hapus Pelanggan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}