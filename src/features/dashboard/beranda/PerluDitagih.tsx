import React, { useState } from 'react';
import { ArrowRight, Copy, ExternalLink, ShoppingBag } from 'lucide-react';
import type { SaldoPelanggan, Transaksi, Warung } from '../../../lib/types';
import { buildPesanTagihan, buildWaLink, formatRupiah, formatTanggalPendek, initials } from '../../../lib/utils';

interface PerluDitagihProps {
  tagihList: SaldoPelanggan[];
  trans: Transaksi[];
  warung: Warung | null;
  namaPemilik: string;
  isLoading: boolean;
  onOpenCustomer: (id: string) => void;
  onLihatSemua: () => void;
}

/** Daftar pelanggan yang perlu ditagih + pratinjau pesan WhatsApp-nya */
export default function PerluDitagih({ tagihList, trans, warung, namaPemilik, isLoading, onOpenCustomer, onLihatSemua }: PerluDitagihProps) {
  const [selectedWaId, setSelectedWaId] = useState<string | null>(null);
  const [copied, setCopied] = useState<'' | 'teks' | 'link'>('');

  const selected = tagihList.find((s) => s.pelanggan_id === selectedWaId) ?? tagihList[0] ?? null;

  const waText = selected && warung
    ? buildPesanTagihan({
        template: warung.template_wa,
        namaWarga: selected.nama,
        namaWarung: warung.nama_warung,
        namaPemilik: warung.nama_pemilik,
        nominal: selected.sisa_utang,
        jatuhTempo: selected.jatuh_tempo_terakhir,
        catatanStruk: warung.catatan_struk,
      })
    : '';

  const waLinkFor = (s: SaldoPelanggan) =>
    buildWaLink(
      s.whatsapp,
      warung
        ? buildPesanTagihan({
            template: warung.template_wa,
            namaWarga: s.nama,
            namaWarung: warung.nama_warung,
            namaPemilik: warung.nama_pemilik,
            nominal: s.sisa_utang,
            jatuhTempo: s.jatuh_tempo_terakhir,
            catatanStruk: warung.catatan_struk,
          })
        : ''
    );

  const lastKasbonOf = (pid: string) => trans.find((t) => t.pelanggan_id === pid && t.jenis === 'kasbon');

  const copy = (text: string, kind: 'teks' | 'link') => {
    navigator.clipboard?.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="font-extrabold text-sm text-slate-900">Perlu Segera Ditagih</h3>
            <span className="bg-rose-100 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded-full">{tagihList.length} Orang</span>
          </div>
          <button onClick={() => onLihatSemua()} className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer">
            <span>Lihat Semua Pelanggan</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {tagihList.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">{isLoading ? 'Memuat data...' : 'Tidak ada yang menunggak. Semua lancar! 🎉'}</p>
          )}
          {tagihList.slice(0, 5).map((s) => {
            const last = lastKasbonOf(s.pelanggan_id);
            const telat = s.hari_telat > 0;
            const aktif = selected?.pelanggan_id === s.pelanggan_id;
            return (
              <div
                key={s.pelanggan_id}
                onClick={() => setSelectedWaId(s.pelanggan_id)}
                className={`p-4 rounded-xl border bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  aktif ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${telat ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'}`}>{initials(s.nama)}</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={(e) => { e.stopPropagation(); onOpenCustomer(s.pelanggan_id); }} className="font-bold text-slate-900 text-xs sm:text-sm hover:underline cursor-pointer">{s.nama}</button>
                      <span className={`${telat ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'} text-[10px] font-bold px-2 py-0.5 rounded`}>
                        {telat ? `Telat ${s.hari_telat} Hari` : 'Jatuh Tempo Hari Ini'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">({s.kode}{s.whatsapp ? ` • ${s.whatsapp}` : ' • belum ada nomor WA'})</p>
                    {last && (
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-slate-400" />
                        <span>Terakhir: {formatTanggalPendek(last.created_at)} • {last.barang || last.catatan || 'Kasbon'}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-medium">Total Kasbon</p>
                    <p className="text-sm sm:text-base font-black text-rose-600">{formatRupiah(s.sisa_utang)}</p>
                  </div>
                  <a
                    href={waLinkFor(s)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Buka wa.me</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 text-lg">💬</span>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Tagihan WA {warung?.template_wa === 'formal' ? 'Formal' : 'Santun'}</h3>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">Link Manual wa.me</span>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Buka link <span className="font-mono text-emerald-700 font-bold">wa.me/62...</span> langsung ke aplikasi/web WhatsApp HP pribadi {namaPemilik} dengan teks pesan yang sudah terisi otomatis (100% gratis tanpa biaya API).
        </p>

        {selected ? (
          <>
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 space-y-2">
              <p className="text-[10px] font-bold text-emerald-900 flex items-center gap-1"><span>❝</span> Pratinjau Pesan ({selected.nama}):</p>
              <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-line">{waText}</p>
            </div>

            <button
              onClick={() => window.open(waLinkFor(selected), '_blank')}
              className="w-full bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka wa.me di WhatsApp</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={() => copy(waText, 'teks')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer">
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{copied === 'teks' ? 'Tersalin! ✓' : 'Salin Teks Pesan'}</span>
              </button>
              <button onClick={() => copy(waLinkFor(selected), 'link')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>{copied === 'link' ? 'Tersalin! ✓' : 'Salin Link wa.me'}</span>
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">Belum ada tagihan yang perlu dikirim.</p>
        )}
      </div>
    </div>
  );
}
