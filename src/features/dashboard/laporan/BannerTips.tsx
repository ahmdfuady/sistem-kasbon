import React from 'react';
import { Share2 } from 'lucide-react';

interface BannerTipsProps {
  namaPemilik?: string;
  skor: 'SEHAT' | 'WASPADA' | 'RAWAN';
  rasioPiutang: number;
  onBagikan: () => void;
}

/** Banner tips keuangan + tombol bagikan rekap lewat WhatsApp */
export default function BannerTips({ namaPemilik, skor, rasioPiutang, onBagikan }: BannerTipsProps) {
  return (
    <div className="bg-gradient-to-r from-[#064e3b] to-[#043d2e] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 text-xl shrink-0">🛡️</div>
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-bold mb-1">
            <span>TIPS KEUANGAN JURAGAN {(namaPemilik || '').toUpperCase()}</span>
            <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">Skor Kasbon: {skor}</span>
          </div>
          <h4 className="text-base sm:text-lg font-black tracking-tight">
            Piutang Warung Anda Berada di {rasioPiutang}% dari Seluruh Kasbon yang Pernah Dicatat
          </h4>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
            {skor === 'SEHAT'
              ? 'Perputaran modal Anda baik. Pertahankan dengan menagih tepat waktu dan menahan kasbon baru bagi warga yang belum melunasi.'
              : skor === 'WASPADA'
              ? 'Sebagian besar kasbon belum kembali. Kirim pengingat WhatsApp ke warga yang mendekati jatuh tempo.'
              : 'Piutang menumpuk. Tahan kasbon baru untuk warga yang menunggak dan fokus menagih dulu.'}
          </p>
        </div>
      </div>

      <button onClick={onBagikan} className="bg-white hover:bg-slate-50 text-emerald-900 font-black text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap transition cursor-pointer shrink-0">
        <Share2 className="w-4 h-4 text-emerald-700" />
        <span>Bagikan Rekap ke Pembukuan</span>
      </button>
    </div>
  );
}
