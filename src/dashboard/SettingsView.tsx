import React, { useRef, useState } from 'react';
import {
  Store, ShieldCheck, CheckCircle2, Image as ImageIcon, Check, MessageCircle,
  Lock, Download, Save, Clock
} from 'lucide-react';
import { useAuth, getRememberPref, setRememberPref } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { validasiFotoProfil, validasiProfilWarung, validasiSandiBaru } from '../validation';
import { listPelanggan, listTransaksi, updateWarung, uploadFotoWarung } from '../lib/api';
import { buildPesanTagihan, downloadCsv, formatWaktu, todayISO } from '../lib/format';

type Plafon = '100' | '200' | '500' | 'unlimited';

const plafonFromValue = (v: number | null | undefined): Plafon => {
  if (v === null || v === undefined) return 'unlimited';
  if (v === 100000) return '100';
  if (v === 500000) return '500';
  return '200';
};

export default function SettingsView() {
  const { warung, user, setWarung } = useAuth();
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
  const [templateStyle, setTemplateStyle] = useState<'santun' | 'formal'>(warung?.template_wa || 'santun');

  // State Keamanan
  const [rememberMe, setRememberMe] = useState(getRememberPref());
  const [showPw, setShowPw] = useState(false);
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
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
          ? 'Gagal upload: bucket "warung-foto" belum dibuat. Jalankan kasbonku_migrasi.sql di Supabase.'
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
      const plafon_default: number | null =
        plafonOption === '100' ? 100000 : plafonOption === '200' ? 200000 : plafonOption === '500' ? 500000 : null;

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

  const handleGantiSandi = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    const errSandi = validasiSandiBaru(pw1, pw2);
    if (errSandi) return setPwMsg({ ok: false, text: errSandi });
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setPwSaving(false);
    if (error) return setPwMsg({ ok: false, text: error.message });
    setPwMsg({ ok: true, text: 'Kata sandi berhasil diperbarui.' });
    setPw1('');
    setPw2('');
    setTimeout(() => setShowPw(false), 1500);
  };

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const [plg, trx] = await Promise.all([listPelanggan(), listTransaksi()]);
      const tgl = todayISO();
      downloadCsv(`cadangan-pelanggan-${tgl}.csv`, [
        ['Kode', 'Nama', 'WhatsApp', 'Alamat', 'Batas Kasbon', 'Catatan Pribadi', 'Terdaftar'],
        ...plg.map((p) => [p.kode, p.nama, p.whatsapp, p.alamat, p.batas_kasbon, p.catatan_pribadi, formatWaktu(p.created_at)]),
      ]);
      downloadCsv(`cadangan-transaksi-${tgl}.csv`, [
        ['Waktu', 'Kode Pelanggan', 'Pelanggan', 'Jenis', 'Nominal', 'Barang', 'Catatan', 'Jatuh Tempo', 'Metode Bayar', 'No Kwitansi'],
        ...trx.map((t) => [formatWaktu(t.created_at), t.pelanggan?.kode, t.pelanggan?.nama, t.jenis, t.nominal, t.barang, t.catatan, t.jatuh_tempo, t.jenis === 'cicilan' ? t.metode_bayar : '', t.no_kwitansi]),
      ]);
    } catch (err: any) {
      alert(err?.message || 'Gagal membuat file cadangan');
    } finally {
      setBackingUp(false);
    }
  };

  const contohPesan = buildPesanTagihan({
    template: templateStyle,
    namaWarga: 'Pak Budi',
    namaWarung: namaWarung || 'Warung',
    namaPemilik,
    nominal: 75000,
    catatanStruk: null,
  });

  const navCls = (id: typeof activeSubTab) =>
    `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
      activeSubTab === id ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
    }`;

  const inputCls =
    'w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition';

  const toggleCls =
    "w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#05603a]";

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

          {/* 1. PROFIL */}
          <div ref={refs.profil} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5 scroll-mt-24">
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
                  <input type="text" value={namaWarung} onChange={(e) => setNamaWarung(e.target.value)} className={inputCls + ' font-bold'} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Nama toko yang paling dikenal oleh para tetangga.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Nama Pemilik / Juragan <span className="text-rose-500">*</span></label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">👤</span>
                  <input type="text" value={namaPemilik} onChange={(e) => setNamaPemilik(e.target.value)} className={inputCls + ' font-bold'} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Nama juragan penanggung jawab kasir warung.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Nomor WhatsApp Warung <span className="text-rose-500">*</span></label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">📞</span>
                  <input type="text" value={whatsappWarung} onChange={(e) => setWhatsappWarung(e.target.value)} className={inputCls + ' font-bold'} />
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
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
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
                <input type="text" value={alamatWarung} onChange={(e) => setAlamatWarung(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Catatan Kaki Struk (Pesan Ramah di Akhir Bon)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">💬</span>
                <input type="text" value={catatanStruk} onChange={(e) => setCatatanStruk(e.target.value)} className={inputCls} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Tercetak di bagian paling bawah nota fisik dan struk WA kasbon.</p>
            </div>
          </div>

          {/* 2. ATURAN */}
          <div ref={refs.aturan} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">📊</div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">2. Aturan & Plafon Kasbon Warga</h3>
                <p className="text-[11px] text-slate-400">Kendalikan perputaran uang modal dagangan warung agar tidak macet.</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 mb-2">Batas Maksimal Kasbon Default per Warga Baru</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {([
                  ['100', 'Aman Pemula', 'Rp 100.000', 'Bagi warga pendatang'],
                  ['200', 'Standar Warung', 'Rp 200.000', 'Cukup untuk sembako pekanan'],
                  ['500', 'Warga Tetangga Akrab', 'Rp 500.000', 'Untuk langganan bertahun-tahun'],
                  ['unlimited', 'Bebas Catat', 'Tanpa Batas', 'Tidak disarankan'],
                ] as const).map(([id, judul, nilai, sub]) => (
                  <div
                    key={id}
                    onClick={() => setPlafonOption(id)}
                    className={`p-3 rounded-xl border cursor-pointer transition text-left relative ${
                      plafonOption === id ? `border-emerald-600 bg-emerald-50/40 ${id === '200' ? 'ring-2 ring-emerald-600/30' : 'ring-1 ring-emerald-500/20'}` : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {id === '200' && (
                      <span className="absolute -top-2 right-2 bg-emerald-700 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">★ REKOMENDASI</span>
                    )}
                    <p className={`text-[10px] font-bold ${id === '200' ? 'text-emerald-800' : 'text-slate-400'}`}>{judul}</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{nilai}</p>
                    <p className={`text-[9px] mt-1 ${id === 'unlimited' ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>{sub}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Plafon default dipakai untuk pelanggan baru dan pelanggan yang belum punya batas sendiri. Batas per pelanggan bisa diubah di buku pelanggan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Jadwal Pengingat Jatuh Tempo</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span className="font-extrabold text-slate-800">7 Hari / 1 Minggu (Sangat Dianjurkan)</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Sistem akan memberi tanda warna merah bila melewati tanggal ini.</p>
              </div>

              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div>
                  <p className="text-xs font-bold text-slate-800">Kunci Pencatatan Kasbon Baru</p>
                  <p className="text-[10px] text-slate-400 leading-snug mt-0.5 max-w-xs">Jika warga memiliki tunggakan lewat jatuh tempo lebih dari 7 hari, tombol tambah utang akan terkunci secara aman.</p>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ Mencegah {warung?.nama_pemilik || 'pemilik'} sungkan menolak tatap muka</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-3">
                  <input type="checkbox" checked={lockKasbon} onChange={(e) => setLockKasbon(e.target.checked)} className="sr-only peer" />
                  <div className={toggleCls}></div>
                </label>
              </div>
            </div>
          </div>

          {/* 3. TEMPLATE WA */}
          <div ref={refs.template} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-24">
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
                  onClick={() => setTemplateStyle(id)}
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

          {/* 4. KEAMANAN */}
          <div ref={refs.keamanan} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4 scroll-mt-24">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">4. Keamanan Akun & Staf Kasir</h3>
                <p className="text-[11px] text-slate-400">Pengaturan hak akses, proteksi ganti kata sandi, dan cadangan data offline.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Email Login Kasir Utama</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span>✉️</span>
                  <span className="truncate">{user?.email ?? '-'}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Email ini terhubung dengan verifikasi akun Supabase.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Kata Sandi Akun</label>
                <button type="button" onClick={() => { setShowPw((v) => !v); setPwMsg(null); }} className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition cursor-pointer">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{showPw ? 'Tutup Form Kata Sandi' : 'Perbarui Kata Sandi Akun'}</span>
                </button>
                <p className="text-[10px] text-slate-400 mt-1">Ganti kata sandi secara berkala agar akun tetap aman.</p>
              </div>
            </div>

            {showPw && (
              <form onSubmit={handleGantiSandi} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-start">
                <input type="password" value={pw1} onChange={(e) => setPw1(e.target.value)} placeholder="Kata sandi baru (min. 8 karakter)" className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} placeholder="Ulangi kata sandi baru" className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                <button type="submit" disabled={pwSaving} className="bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-60 text-white font-bold text-xs rounded-xl px-3 py-2.5 cursor-pointer">{pwSaving ? 'Menyimpan...' : 'Simpan Kata Sandi'}</button>
                {pwMsg && <p className={`sm:col-span-3 text-[11px] font-bold ${pwMsg.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{pwMsg.text}</p>}
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Ingat Saya di Komputer Kasir Ini</p>
                  <p className="text-[10px] text-slate-400">{warung?.nama_pemilik || 'Anda'} tidak perlu bolak-balik ketik sandi tiap pagi buka warung.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-3">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => { setRememberMe(e.target.checked); setRememberPref(e.target.checked); }} className="sr-only peer" />
                  <div className={toggleCls}></div>
                </label>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Cadangan Buku Kasbon Warga</p>
                  <p className="text-[10px] text-slate-400">Simpan salinan utang warga ke flashdisk atau laptop (XLS / CSV).</p>
                </div>
                <button type="button" disabled={backingUp} onClick={handleBackup} className="bg-white hover:bg-slate-100 disabled:opacity-60 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0 ml-2">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{backingUp ? 'Menyiapkan...' : 'Unduh File'}</span>
                </button>
              </div>
            </div>
          </div>

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
