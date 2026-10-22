import React, { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import type { Pelanggan } from '../../../../lib/types';

interface PengingatWAProps {
  pelanggan: Pelanggan;
  waMessage: string;
  waLink: string;
}

/** Pratinjau pesan tagihan + tombol buka/salin tautan wa.me */
export default function PengingatWA({ pelanggan, waMessage, waLink }: PengingatWAProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const waLinkText = waLink.replace('https://', '');

  const handleCopyLink = (link: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 text-lg">💬</span>
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Pengingat WhatsApp</h3>
        </div>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">Gratis Tanpa Bot API</span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Klik tombol di bawah untuk langsung membuka chat WhatsApp pribadi Anda ke nomor {pelanggan.nama} ({pelanggan.whatsapp || 'nomor belum diisi'}) dengan draf pesan kasbon yang sudah terangkai rapi via tautan wa.me.
      </p>

      <div className="bg-[#e7f8ee] border border-emerald-100/90 rounded-2xl p-3.5 relative text-xs text-slate-800 leading-relaxed">
        <p className="text-[11px] whitespace-pre-line">{waMessage}</p>
        <div className="text-right text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
          <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')}</span>
          <span className="text-emerald-600 font-bold">✓✓</span>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="truncate max-w-[200px]">{waLinkText}</span>
        <button onClick={() => handleCopyLink(waLink)} className="text-emerald-700 font-bold hover:underline shrink-0 ml-2 flex items-center gap-1 cursor-pointer">
          <Copy className="w-3 h-3" />
          <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
        </button>
      </div>

      <button onClick={() => window.open(waLink, '_blank')} className="w-full bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer">
        <ExternalLink className="w-4 h-4" />
        <span>Buka Link wa.me di WhatsApp</span>
      </button>

      <p className="text-center text-[10px] text-slate-400 leading-tight">
        100% Aman & Gratis: Dikirim langsung dari HP/WhatsApp pemilik warung tanpa perantara bot API.
      </p>
    </div>
  );
}
