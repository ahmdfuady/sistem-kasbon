import React, { useRef, useState } from 'react';
import { Store, ShieldCheck, CheckCircle2, MessageCircle, Save } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { validasiFotoProfil, validasiProfilWarung } from '../../../validation';
import { updateWarung, uploadFotoWarung } from '../../../api';
import type { TemplateWa } from '../../../lib/types';
import { plafonFromValue, plafonToValue, type Plafon } from './plafon';
import ProfilSection from './ProfilSection';
import AturanSection from './AturanSection';
import TemplateSection from './TemplateSection';
import KeamananSection from './KeamananSection';

/**
 * Halaman Pengaturan. Profil, aturan, dan template WA disimpan bersama lewat satu tombol
 * "Simpan Semua Perubahan"; bagian Keamanan punya tombolnya sendiri.
 */
export default function SettingsView() {
  const { warung, setWarung } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'profil' | 'aturan' | 'template' | 'keamanan'>('profil');

  // State Profil (inisiasi dari database)
  const [namaWarung, setNamaWarung] = useState(warung?.nama_warung || '');
  const [namaPemilik, setNamaPemilik] = useState(warung?.nama_pemilik || '');
  const [whatsappWarung, setWhatsappWarung] = useState(warung?.whatsapp || '');
  const [alamatWarung, setAlamatWarung] = useState(warung?.alamat || '');
  const [catatanStruk, setCatatanStruk] = useState(warung?.catatan_struk || '');
  const [fotoUrl, setFotoUrl] = useState(warung?.foto_url || '');
  const [fotoNama, setFotoNama] = useState('');
  const [uploading, setUploading] = useState(false);

  // State Aturan
  const [plafonOption, setPlafonOption] = useState<Plafon>(plafonFromValue(warung?.plafon_default));
  const [lockKasbon, setLockKasbon] = useState(warung?.kunci_kasbon ?? true);

  // State Template WA
  const [templateStyle, setTemplateStyle] = useState<TemplateWa>(warung?.template_wa || 'santun');

  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const refs = {
    profil: useRef<HTMLDivElement>(null),
    aturan: useRef<HTMLDivElement>(null),
    template: useRef<HTMLDivElement>(null),
    keamanan: useRef<HTMLDivElement>(null),
  };

  const goTab = (id: typeof activeSubTab) => {
    setActiveSubTab(id);
    refs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const idToko = warung ? `WRG-${warung.id.replace(/-/g, '').slice(0, 5).toUpperCase()}` : '-';

  const resetForm = () => {
    setNamaWarung(warung?.nama_warung || '');
    setNamaPemilik(warung?.nama_pemilik || '');
    setWhatsappWarung(warung?.whatsapp || '');
    setAlamatWarung(warung?.alamat || '');
    setCatatanStruk(warung?.catatan_struk || '');
    setFotoUrl(warung?.foto_url || '');
    setFotoNama('');
    setPlafonOption(plafonFromValue(warung?.plafon_default));
    setLockKasbon(warung?.kunci_kasbon ?? true);
    setTemplateStyle(warung?.template_wa || 'santun');
    setSaveMsg(null);
  };

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !warung) return;
    const errFoto = validasiFotoProfil(file);
    if (errFoto) return setSaveMsg({ ok: false, text: errFoto });
    setUploading(true);
    setSaveMsg(null);
    try {
      const url = await uploadFotoWarung(warung.id, file);
      setFotoUrl(url);
      setFotoNama(file.name);
      // simpan langsung supaya tidak hilang
      const upd = await updateWarung(warung.id, { foto_url: url });
      setWarung(upd);
      setSaveMsg({ ok: true, text: 'Foto profil warung diperbarui.' });
    } catch (err: any) {
      setSaveMsg({
        ok: false,
        text: /bucket|not found|row-level/i.test(err?.message || '')
          ? 'Gagal upload: bucket "warung-foto" belum dibuat. Jalankan database/01_kasbonku_migrasi.sql di Supabase.'
          : err?.message || 'Gagal mengunggah foto.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!warung) return;
    const errProfil = validasiProfilWarung({ namaWarung, namaPemilik, whatsapp: whatsappWarung });
    if (errProfil) return setSaveMsg({ ok: false, text: errProfil });
    setIsSaving(true);
    setSaveMsg(null);
    try {
      const plafon_default = plafonToValue(plafonOption);

      const updated = await updateWarung(warung.id, {
        nama_warung: namaWarung.trim(),
        nama_pemilik: namaPemilik.trim(),
        whatsapp: whatsappWarung.trim() || null,
        alamat: alamatWarung.trim() || null,
        catatan_struk: catatanStruk.trim() || null,
        plafon_default,
        kunci_kasbon: lockKasbon,
        template_wa: templateStyle,
      });
      setWarung(updated);
      setSaveMsg({ ok: true, text: 'Seluruh perubahan pengaturan warung berhasil disimpan.' });
    } catch (err: any) {
      setSaveMsg({ ok: false, text: err?.message || 'Gagal menyimpan pengaturan' });
    } finally {
      setIsSaving(false);
    }
  };

  const navCls = (id: typeof activeSubTab) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
      activeSubTab === id ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-slate-200/60 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/80 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Sinkronisasi Server Cloud Aktif • Dicadangkan Otomatis</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Pengaturan Warung & Akun</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil warung, batas plafon kasbon warga, template pesan WhatsApp santun, dan keamanan akun kasir {warung?.nama_pemilik || 'Anda'}.
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 px-4 shadow-sm flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold"><Store className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">ID Toko Warung</p>
            <p className="text-xs font-black text-slate-900 tracking-tight">{idToko}</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700"><CheckCircle2 className="w-2.5 h-2.5" /> Terverifikasi Aman</span>
          </div>
        </div>
      </div>

      {/* Grid Konten Pengaturan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* SUB MENU KIRI */}
        <div className="lg:col-span-3 space-y-3 lg:sticky lg:top-20">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm space-y-1 text-xs font-bold">
            <button type="button" onClick={() => goTab('profil')} className={navCls('profil')}><Store className="w-4 h-4" /><span>Profil Warung</span></button>
            <button type="button" onClick={() => goTab('aturan')} className={navCls('aturan')}><span className="text-base leading-none">📊</span><span>Aturan Kasbon</span></button>
            <button type="button" onClick={() => goTab('template')} className={navCls('template')}><MessageCircle className="w-4 h-4" /><span>Template WhatsApp</span></button>
            <button type="button" onClick={() => goTab('keamanan')} className={navCls('keamanan')}><ShieldCheck className="w-4 h-4" /><span>Keamanan & Staf</span></button>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-xs space-y-1.5">
            <p className="font-bold text-emerald-900 flex items-center gap-1.5"><span>💡 Panduan {warung?.nama_pemilik || 'Juragan'}</span></p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Semua catatan kasbon tersimpan otomatis di server dan bisa dibuka dari HP maupun laptop. Pengaturan nota struk akan tercantum tiap kali kamu mengirim nota atau mencetak rincian kasbon.
            </p>
          </div>
        </div>

        {/* KONTEN KANAN */}
        <div className="lg:col-span-9 space-y-6">

          <ProfilSection
            sectionRef={refs.profil}
            namaWarung={namaWarung}
            onNamaWarungChange={setNamaWarung}
            namaPemilik={namaPemilik}
            onNamaPemilikChange={setNamaPemilik}
            whatsappWarung={whatsappWarung}
            onWhatsappChange={setWhatsappWarung}
            alamatWarung={alamatWarung}
            onAlamatChange={setAlamatWarung}
            catatanStruk={catatanStruk}
            onCatatanStrukChange={setCatatanStruk}
            fotoUrl={fotoUrl}
            fotoNama={fotoNama}
            uploading={uploading}
            onFotoChange={handleFoto}
          />

          <AturanSection
            sectionRef={refs.aturan}
            plafonOption={plafonOption}
            onPlafonChange={setPlafonOption}
            lockKasbon={lockKasbon}
            onLockChange={setLockKasbon}
          />

          <TemplateSection
            sectionRef={refs.template}
            templateStyle={templateStyle}
            onTemplateChange={setTemplateStyle}
            namaWarung={namaWarung}
            namaPemilik={namaPemilik}
            catatanStruk={catatanStruk}
          />

          <KeamananSection sectionRef={refs.keamanan} />

          {/* TOMBOL SIMPAN */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${saveMsg ? (saveMsg.ok ? 'text-emerald-700' : 'text-rose-600') : 'text-emerald-700'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {saveMsg ? saveMsg.text : 'Perubahan langsung aktif di tablet & ponsel kasir warung.'}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={resetForm} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer">Batal / Reset ke Awal</button>
              <button type="button" onClick={() => handleSave()} disabled={isSaving} className="bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-60 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan Pengaturan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
