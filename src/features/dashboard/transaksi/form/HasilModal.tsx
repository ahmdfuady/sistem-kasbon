import { useState } from 'react';
import { CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { buildWaLink, formatRupiah } from '../../../../lib/utils';

export interface Hasil {
  jenis: 'kasbon' | 'cicilan';
  nama: string;
  whatsapp: string | null;
  teks: string;
  nominal: number;
  sisa: number;
}

interface HasilModalProps {
  hasil: Hasil;
  onCatatLagi: () => void;
  onSelesai: () => void;
}

/** Jendela "Berhasil Dicatat" + tombol kirim nota/kwitansi lewat wa.me */
export default function HasilModal({ hasil, onCatatLagi, onSelesai }: HasilModalProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Berhasil Dicatat!</h3>
            <p className="text-[11px] text-slate-500">
              {hasil.jenis === 'kasbon' ? 'Kasbon' : 'Pembayaran'} {formatRupiah(hasil.nominal)} • {hasil.nama} • Sisa {formatRupiah(hasil.sisa)}
            </p>
          </div>
        </div>

        <div className="bg-[#e7f8ee] border border-emerald-100 rounded-2xl p-3.5 text-[11px] text-slate-800 leading-relaxed whitespace-pre-line">{hasil.teks}</div>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={buildWaLink(hasil.whatsapp, hasil.teks)}
            target="_blank"
            rel="noreferrer"
            className="col-span-2 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{hasil.jenis === 'kasbon' ? 'Kirim Nota via WhatsApp' : 'Kirim Kwitansi via WhatsApp'}</span>
          </a>
          <button
            type="button"
            onClick={() => { navigator.clipboard?.writeText(hasil.teks); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>{copied ? 'Tersalin! ✓' : 'Salin Teks'}</span>
          </button>
          <button type="button" onClick={onCatatLagi} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer">
            Catat Lagi
          </button>
          <button type="button" onClick={onSelesai} className="col-span-2 bg-[#05603a] hover:bg-[#044e2f] text-white font-black py-2.5 rounded-xl text-xs cursor-pointer">
            Selesai
          </button>
        </div>
        {!hasil.whatsapp && <p className="text-[10px] text-slate-400 text-center">Pelanggan belum punya nomor WA, kamu bisa memilih kontak sendiri di WhatsApp.</p>}
      </div>
    </div>
  );
}
