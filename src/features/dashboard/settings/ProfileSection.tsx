import React, { useRef } from 'react';
import { Store, Image as ImageIcon } from 'lucide-react';
import { inputCls } from './styles';

interface ProfileSectionProps {
  sectionRef: React.Ref<HTMLDivElement>;
  namaWarung: string;
  onNamaWarungChange: (v: string) => void;
  namaPemilik: string;
  onNamaPemilikChange: (v: string) => void;
  whatsappWarung: string;
  onWhatsappChange: (v: string) => void;
  alamatWarung: string;
  onAlamatChange: (v: string) => void;
  catatanStruk: string;
  onCatatanStrukChange: (v: string) => void;
  fotoUrl: string;
  fotoNama: string;
  uploading: boolean;
  onFotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/** 1. Profil warung: nama, pemilik, WhatsApp, foto, alamat, catatan struk */
export default function ProfileSection({
  sectionRef, namaWarung, onNamaWarungChange, namaPemilik, onNamaPemilikChange, whatsappWarung, onWhatsappChange,
  alamatWarung, onAlamatChange, catatanStruk, onCatatanStrukChange, fotoUrl, fotoNama, uploading, onFotoChange,
}: ProfileSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div ref={sectionRef} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 scroll-mt-24">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Store className="w-4 h-4" /></div>
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">1. Profil Warung Kelontong</h3>
          <p className="text-[11px] text-slate-400">Informasi identitas warung yang akan dicetak pada kepala nota belanjaan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Nama Warung <span className="text-rose-500">*</span></label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400">🏪</span>
            <input type="text" value={namaWarung} onChange={(e) => onNamaWarungChange(e.target.value)} className={inputCls + ' font-bold'} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Nama toko yang paling dikenal oleh para tetangga.</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Nama Pemilik / Juragan <span className="text-rose-500">*</span></label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400">👤</span>
            <input type="text" value={namaPemilik} onChange={(e) => onNamaPemilikChange(e.target.value)} className={inputCls + ' font-bold'} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Nama juragan penanggung jawab kasir warung.</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Nomor WhatsApp Warung <span className="text-rose-500">*</span></label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-400">📞</span>
            <input type="text" value={whatsappWarung} onChange={(e) => onWhatsappChange(e.target.value)} className={inputCls + ' font-bold'} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Nomor utama untuk mengirim struk & tautan bayar wa.me.</p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 block mb-1">Foto Profil Warung</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 px-3">
            {fotoUrl ? <img src={fotoUrl} alt="Foto warung" className="w-8 h-8 rounded-lg object-cover shrink-0" /> : <ImageIcon className="w-5 h-5 text-slate-400 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{fotoNama || (fotoUrl ? 'Foto warung tersimpan' : 'Belum ada foto')}</p>
              <p className="text-[10px] text-slate-400">JPG/PNG, maks 2 MB</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFotoChange} />
            <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()} className="bg-white hover:bg-slate-100 disabled:opacity-60 border border-slate-200 text-slate-700 font-bold text-[10px] px-2.5 py-1 rounded-lg transition cursor-pointer">
              {uploading ? 'Mengunggah...' : fotoUrl ? 'Ganti' : 'Unggah'}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Akan muncul di profil tautan tagihan pelanggan.</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1">Alamat Lengkap Toko (Tercantum di Nota Belanja)</label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-400">📍</span>
          <input type="text" value={alamatWarung} onChange={(e) => onAlamatChange(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-800 block mb-1">Catatan Kaki Struk (Pesan Ramah di Akhir Bon)</label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-400">💬</span>
          <input type="text" value={catatanStruk} onChange={(e) => onCatatanStrukChange(e.target.value)} className={inputCls} />
        </div>
        <p className="text-[10px] text-slate-400 mt-1">Tercetak di bagian paling bawah nota fisik dan struk WA kasbon.</p>
      </div>
    </div>
  );
}
