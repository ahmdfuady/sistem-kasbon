import React, { useState } from 'react';
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  Check,
  MessageCircle,
  Lock,
  Download,
  Save,
  Clock
} from 'lucide-react';

export default function SettingsView() {
  const [activeSubTab, setActiveSubTab] = useState<'profil' | 'aturan' | 'template' | 'keamanan'>('profil');

  // State Profil
  const [namaWarung, setNamaWarung] = useState('Warung Barokah Bu Siti');
  const [namaPemilik, setNamaPemilik] = useState('Bu Siti Aminah');
  const [whatsappWarung, setWhatsappWarung] = useState('0812-9876-5432');
  const [alamatWarung, setAlamatWarung] = useState('Jl. Mawar No. 14, RT 03 / RW 02, Kelurahan Sukamaju');
  const [catatanStruk, setCatatanStruk] = useState('Matur nuwun sampun blonjo wonten Warung Bu Siti. Berkah & lancar rezekinya.');

  // State Aturan
  const [plafonOption, setPlafonOption] = useState<'100' | '200' | '500' | 'unlimited'>('200');
  const [lockKasbon, setLockKasbon] = useState(true);

  // State Template WA
  const [templateStyle, setTemplateStyle] = useState<'santun' | 'formal'>('santun');

  // State Keamanan
  const [rememberMe, setRememberMe] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Seluruh perubahan pengaturan warung berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-slate-200/60 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/80 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Sinkronisasi Server Cloud Indonesia Aktif • Dicadangkan Otomatis</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Warung & Akun
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Kelola profil warung, batas plafon kasbon warga, template pesan WhatsApp santun, dan keamanan akun kasir Bu Siti.
          </p>
        </div>

        {/* ID Toko Warung Badge Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 px-4 shadow-sm flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">ID Toko Warung</p>
            <p className="text-xs font-black text-slate-900 tracking-tight">WRG-88219-JKT</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700">
              <CheckCircle2 className="w-2.5 h-2.5" /> Terverifikasi Aman
            </span>
          </div>
        </div>
      </div>

      {/* Grid Konten Pengaturan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= SUB MENU NAVIGASI KIRI ================= */}
        <div className="lg:col-span-3 space-y-3 sticky top-20">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-sm space-y-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveSubTab('profil')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSubTab === 'profil'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Profil Warung</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('aturan')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSubTab === 'aturan'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-base leading-none">📊</span>
              <span>Aturan Kasbon</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('template')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSubTab === 'template'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Template WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('keamanan')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                activeSubTab === 'keamanan'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Keamanan & Staf</span>
            </button>
          </div>

          {/* Panduan Bu Siti */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-xs space-y-1.5">
            <p className="font-bold text-emerald-900 flex items-center gap-1.5">
              <span>💡 Panduan Bu Siti</span>
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Semua catatan kasbon tersimpan otomatis di HP dan laptop ini. Pengaturan nota struk akan dicetak tiap kali Bu Siti menekan tombol cetak kasbon.
            </p>
          </div>
        </div>

        {/* ================= KONTEN FORMULIR KANAN ================= */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* 1. PROFIL WARUNG KELONTONG */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">1. Profil Warung Kelontong</h3>
                <p className="text-[11px] text-slate-400">Informasi identitas warung yang akan dicetak pada kepala nota belanjaan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nama Warung <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">🏪</span>
                  <input
                    type="text"
                    value={namaWarung}
                    onChange={(e) => setNamaWarung(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Nama toko yang paling dikenal oleh para tetangga.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nama Pemilik / Juragan <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">👤</span>
                  <input
                    type="text"
                    value={namaPemilik}
                    onChange={(e) => setNamaPemilik(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Nama juragan penanggung jawab kasir warung.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nomor WhatsApp Warung <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400">📞</span>
                  <input
                    type="text"
                    value={whatsappWarung}
                    onChange={(e) => setWhatsappWarung(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Nomor utama untuk mengirim struk & tautan bayar wa.me.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Foto Profil Warung
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 px-3">
                  <ImageIcon className="w-5 h-5 text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">foto-depan-warung.jpg</p>
                    <p className="text-[10px] text-slate-400">Ukuran 1.2 MB</p>
                  </div>
                  <button type="button" className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] px-2.5 py-1 rounded-lg transition cursor-pointer">
                    Ganti
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Akan muncul di profil tautan tagihan pelanggan.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Alamat Lengkap Toko (Tercantum di Nota Belanja)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">📍</span>
                <input
                  type="text"
                  value={alamatWarung}
                  onChange={(e) => setAlamatWarung(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Catatan Kaki Struk (Pesan Ramah di Akhir Bon)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400">💬</span>
                <input
                  type="text"
                  value={catatanStruk}
                  onChange={(e) => setCatatanStruk(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Tercetak di bagian paling bawah nota fisik dan struk WA kasbon.</p>
            </div>

            {/* Tombol Simpan Profil */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-slate-100 gap-3">
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Perubahan langsung aktif di tablet & ponsel kasir warung.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Pengaturan direset ke awal')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  Batal / Reset ke Awal
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-[#05603a] hover:bg-[#044e2f] text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Semua Perubahan Pengaturan</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. ATURAN & PLAFON KASBON WARGA */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                📊
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">2. Aturan & Plafon Kasbon Warga</h3>
                <p className="text-[11px] text-slate-400">Kendalikan perputaran uang modal dagangan warung agar tidak macet.</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 mb-2">Batas Maksimal Kasbon Default per Warga Baru</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                {/* 100k */}
                <div
                  onClick={() => setPlafonOption('100')}
                  className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                    plafonOption === '100' ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] text-slate-400 font-bold">Aman Pemula</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">Rp 100.000</p>
                  <p className="text-[9px] text-slate-400 mt-1">Bagi warga pendatang</p>
                </div>

                {/* 200k (Rekomendasi) */}
                <div
                  onClick={() => setPlafonOption('200')}
                  className={`p-3 rounded-xl border cursor-pointer transition text-left relative ${
                    plafonOption === '200' ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/30' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2 right-2 bg-emerald-700 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    ★ REKOMENDASI
                  </span>
                  <p className="text-[10px] text-emerald-800 font-bold">Standar Warung</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">Rp 200.000</p>
                  <p className="text-[9px] text-slate-400 mt-1">Cukup untuk sembako pekanan</p>
                </div>

                {/* 500k */}
                <div
                  onClick={() => setPlafonOption('500')}
                  className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                    plafonOption === '500' ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] text-slate-400 font-bold">Warga Tetangga Akrab</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">Rp 500.000</p>
                  <p className="text-[9px] text-slate-400 mt-1">Untuk langganan bertahun-tahun</p>
                </div>

                {/* Unlimited */}
                <div
                  onClick={() => setPlafonOption('unlimited')}
                  className={`p-3 rounded-xl border cursor-pointer transition text-left ${
                    plafonOption === 'unlimited' ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] text-slate-400 font-bold">Bebas Catat</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">Tanpa Batas</p>
                  <p className="text-[9px] text-rose-500 font-bold mt-1">Tidak disarankan</p>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Jadwal Pengingat Jatuh Tempo
                </label>
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
                  <p className="text-[10px] text-slate-400 leading-snug mt-0.5 max-w-xs">
                    Jika warga memiliki tunggakan lewat jatuh tempo lebih dari 7 hari, tombol tambah utang akan terkunci secara aman.
                  </p>
                  <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ Mencegah Bu Siti sungkan menolak tatap muka</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer ml-3">
                  <input
                    type="checkbox"
                    checked={lockKasbon}
                    onChange={(e) => setLockKasbon(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#05603a]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 3. TEMPLATE PESAN WHATSAPP SANTUN */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">3. Template Pesan WhatsApp Santun</h3>
                  <p className="text-[11px] text-slate-400">Kirim tagihan tanpa rasa sungkan atau canggung sesama tetangga dekat.</p>
                </div>
              </div>

              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Gratis via wa.me
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setTemplateStyle('santun')}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-left flex items-start gap-2.5 ${
                  templateStyle === 'santun' ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${templateStyle === 'santun' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                  {templateStyle === 'santun' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Gaya Santun Bertetangga (Rekomendasi)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hangat, diawali salam & doa, tidak terkesan menagih kasar.</p>
                </div>
              </div>

              <div
                onClick={() => setTemplateStyle('formal')}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-left flex items-start gap-2.5 ${
                  templateStyle === 'formal' ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${templateStyle === 'formal' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                  {templateStyle === 'formal' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Gaya Ringkas & Formal</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Langsung mencantumkan nomor nota dan rincian belanjaan.</p>
                </div>
              </div>
            </div>

            {/* Mockup Chat WA di Layar Pembeli */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                <span>Simulasi Tampilan WhatsApp di Layar Pembeli:</span>
                <span className="text-[10px] font-normal text-slate-400">Preview Otomatis</span>
              </div>

              <div className="bg-[#e5ddd5] p-4 rounded-2xl border border-slate-300/80 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">S</div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Warung Barokah Bu Siti (Bu Siti)</p>
                    <p className="text-[9px] text-slate-500">Online • WhatsApp Resmi</p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm max-w-lg text-xs text-slate-800 leading-relaxed space-y-2">
                  <p>
                    Assalamu&apos;alaikum / Halo Pak/Bu <strong>[Nama Warga]</strong>, mohon maaf mengganggu waktunya sekadar mengingatkan catatan kasbon warung Barokah Bu Siti sebesar <strong>Rp [Nominal]</strong>.
                  </p>
                  <p>
                    Barangkali berkenan disenggangkan hari ini sambil lewat depan warung nggih. Matur nuwun & mugi berkah selalu rezekinya sekeluarga. 🙏✨
                  </p>
                  <div className="text-right text-[9px] text-slate-400 flex items-center justify-end gap-1">
                    <span>Nota #KWT-0142</span>
                    <span>15:42</span>
                    <span className="text-sky-600 font-bold">✓✓</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur rounded-xl p-2 text-[10px] text-slate-600 flex items-center gap-2">
                  <span>📱</span>
                  <span>Pesan ini otomatis salin ke aplikasi WhatsApp Bu Siti saat menekan tombol kirim tagihan. 100% aman tanpa biaya bulanan bot.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. KEAMANAN AKUN & STAF KASIR */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">4. Keamanan Akun & Staf Kasir</h3>
                <p className="text-[11px] text-slate-400">Pengaturan hak akses, proteksi ganti kata sandi, dan cadangan data offline.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Email Login Kasir Utama
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center gap-2 text-xs font-bold text-slate-800">
                  <span>✉️</span>
                  <span>siti.barokah@gmail.com</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Email ini terhubung dengan verifikasi Google Cloud.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Kata Sandi Akun
                </label>
                <button
                  type="button"
                  onClick={() => alert('Form ganti kata sandi dibuka')}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2.5 px-3 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Perbarui Kata Sandi Akun</span>
                </button>
                <p className="text-[10px] text-slate-400 mt-1">Terakhir diubah 3 minggu yang lalu.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Ingat Saya di Komputer Kasir Ini</p>
                  <p className="text-[10px] text-slate-400">Bu Siti tidak perlu bolak-balik ketik sandi tiap pagi buka warung.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-3">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#05603a]"></div>
                </label>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Cadangan Buku Kasbon Warga</p>
                  <p className="text-[10px] text-slate-400">Simpan salinan utang warga ke flashdisk atau laptop (XLS / CSV).</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('File cadangan buku kasbon berhasil diunduh!')}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition cursor-pointer shrink-0 ml-2"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unduh File</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}