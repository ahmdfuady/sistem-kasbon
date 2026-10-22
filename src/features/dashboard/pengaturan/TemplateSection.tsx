import React from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { buildPesanTagihan } from '../../../lib/utils';
import type { TemplateWa } from '../../../lib/types';

interface TemplateSectionProps {
  sectionRef: React.Ref<HTMLDivElement>;
  templateStyle: TemplateWa;
  onTemplateChange: (v: TemplateWa) => void;
  namaWarung: string;
  namaPemilik: string;
  catatanStruk: string;
}

/** 3. Pilih gaya pesan tagihan WhatsApp + simulasi tampilannya */
export default function TemplateSection({
  sectionRef, templateStyle, onTemplateChange, namaWarung, namaPemilik, catatanStruk,
}: TemplateSectionProps) {
  const contohPesan = buildPesanTagihan({
    template: templateStyle,
    namaWarga: 'Pak Budi',
    namaWarung: namaWarung || 'Warung',
    namaPemilik,
    nominal: 75000,
    catatanStruk: null,
  });

  return (
    <div ref={sectionRef} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-24">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><MessageCircle className="w-4 h-4" /></div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">3. Template Pesan WhatsApp Santun</h3>
            <p className="text-[11px] text-slate-400">Kirim tagihan tanpa rasa sungkan atau canggung sesama tetangga dekat.</p>
          </div>
        </div>
        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 whitespace-nowrap">100% Gratis via wa.me</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {([
          ['santun', 'Gaya Santun Bertetangga (Rekomendasi)', 'Hangat, diawali salam & doa, tidak terkesan menagih kasar.'],
          ['formal', 'Gaya Ringkas & Formal', 'Langsung mencantumkan nominal dan permintaan pembayaran.'],
        ] as const).map(([id, judul, sub]) => (
          <div
            key={id}
            onClick={() => onTemplateChange(id)}
            className={`p-3.5 rounded-xl border cursor-pointer transition text-left flex items-start gap-2.5 ${templateStyle === id ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${templateStyle === id ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
              {templateStyle === id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{judul}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
          <span>Simulasi Tampilan WhatsApp di Layar Pembeli:</span>
          <span className="text-[10px] font-normal text-slate-400">Preview Otomatis</span>
        </div>

        <div className="bg-[#e5ddd5] p-4 rounded-2xl border border-slate-300/80 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">{(namaPemilik || 'W').charAt(0).toUpperCase()}</div>
            <div>
              <p className="text-[11px] font-bold text-slate-900">{namaWarung || 'Warung'} {namaPemilik ? `(${namaPemilik})` : ''}</p>
              <p className="text-[9px] text-slate-500">Online • WhatsApp</p>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-lg text-xs text-slate-800 leading-relaxed space-y-2 whitespace-pre-line">
            <p>{contohPesan}</p>
            {catatanStruk && <p className="text-slate-500">{catatanStruk}</p>}
            <div className="text-right text-[9px] text-slate-400 flex items-center justify-end gap-1">
              <span>Contoh: Pak Budi • Rp 75.000</span>
              <span className="text-sky-600 font-bold">✓✓</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-2 text-[10px] text-slate-600 flex items-center gap-2">
            <span>📱</span>
            <span>Pesan ini otomatis terisi di aplikasi WhatsApp {namaPemilik || 'Anda'} saat menekan tombol kirim tagihan. 100% aman tanpa biaya bulanan bot.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
