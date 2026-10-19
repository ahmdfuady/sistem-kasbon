import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Store, 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Smartphone, 
  ChevronDown, 
  ArrowRight, 
  Play, 
  Star,
  DollarSign
} from 'lucide-react';

interface KasbonKuLandingProps {
  onStartFree?: () => void;
}

export default function KasbonKuLanding({ onStartFree }: KasbonKuLandingProps) {
  // State Kalkulator Simulasi
  const [kasbonHarian, setKasbonHarian] = useState<number>(150000);
  const [jumlahPelanggan, setJumlahPelanggan] = useState<number>(10);

  // State FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const formatRupiah = (val: number) => {
    return 'Rp ' + val.toLocaleString('id-ID');
  };

  const totalMengendap = kasbonHarian * jumlahPelanggan;
  const estimasiHemat = Math.round(totalMengendap * 0.65);

  const faqs = [
    {
      q: 'Apakah aplikasi ini benar-benar gratis?',
      a: 'Ya, fitur pencatatan kasbon, batas limit, dan pengingat WhatsApp santun bisa Anda gunakan 100% gratis untuk mendukung pertumbuhan warung tradisional Indonesia.'
    },
    {
      q: 'Bagaimana jika HP saya hilang atau rusak?',
      a: 'Tenang saja! Seluruh data tersimpan otomatis di cloud server yang aman. Anda cukup login kembali dengan nomor HP terdaftar di HP baru.'
    },
    {
      q: 'Apakah pelanggan tetangga harus download aplikasi ini juga?',
      a: 'Tidak perlu sama sekali! Pelanggan Anda cukup menerima nota atau pesan pengingat ramah lewat aplikasi WhatsApp yang biasa mereka pakai.'
    },
    {
      q: 'Apakah nomor kontak tetangga saya aman dan tidak disalahgunakan?',
      a: 'Sangat aman. Privasi data Anda dan nomor kontak pelanggan terenkripsi dan tidak akan pernah dibagikan ke pihak ketiga.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-600/30">
              K
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Kasbon<span className="text-emerald-600">Ku</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#masalah" className="hover:text-emerald-600 transition">Kenapa KasbonKu</a>
            <a href="#fitur" className="hover:text-emerald-600 transition">Fitur Warung</a>
            <a href="#simulasi" className="hover:text-emerald-600 transition">Simulasi</a>
            <a href="#cara-kerja" className="hover:text-emerald-600 transition">Cara Pakai</a>
            <a href="#testimoni" className="hover:text-emerald-600 transition">Testimoni</a>
            <a href="#faq" className="hover:text-emerald-600 transition">Tanya Jawab</a>
          </nav>

          <button 
            onClick={onStartFree}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition shadow-sm hover:shadow-md cursor-pointer"
          >
            Mulai Gratis
          </button>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Teks Hero */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Pelopor Pencatatan Kasbon Warung Cerdas #1 di Indonesia
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.2] tracking-tight">
                Kelola Kasbon Tetangga Rapi,{' '}
                <span className="text-emerald-600 underline decoration-emerald-500/40 decoration-wavy">
                  Modal Warung Aman
                </span>{' '}
                & Rezeki Berkah.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Tinggalkan buku tulis kusam yang rentan hilang atau rusak. Catat kasbon seketika, pantau batas pinjaman pelanggan, dan kirim pengingat ramah via WhatsApp tanpa rasa canggung.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={onStartFree}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Pakai Gratis Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 transition flex items-center gap-2 shadow-sm">
                  <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  <span>Lihat Demo Singkat</span>
                </button>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Gratis & Bebas Iklan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Data Aman Terenkripsi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Siap Pakai 30 Detik</span>
                </div>
              </div>
            </div>

            {/* Mockup Card App Hero */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-2xl opacity-20"></div>
              
              <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Warung Berkah Bu Siti</h4>
                      <p className="text-[10px] text-slate-400">Jalan Mawar No. 12 • Online</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-200">
                    Aktif
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-rose-50/70 border border-rose-100 p-3.5 rounded-xl">
                    <p className="text-[11px] text-slate-500 font-medium">Total Kasbon Belum Lunas</p>
                    <p className="text-lg font-extrabold text-rose-600 mt-1">Rp 1.380.000</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                    <p className="text-[11px] text-slate-500 font-medium">Pelanggan Kasbon</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-lg font-extrabold text-slate-800">8 Orang</span>
                      <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">Perlu ditagih</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
                    <span>CATATAN TERBARU</span>
                    <span>STATUS</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">PJ</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Pak Joko (RT 03)</p>
                        <p className="text-[10px] text-slate-400">Telur 1kg, Beras 2kg • Hari ini</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-600">Rp 45.000</p>
                      <span className="text-[9px] text-amber-600 font-medium">Jatuh Tempo</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">BR</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Bu Ratna</p>
                        <p className="text-[10px] text-slate-400">Minyak Goreng 2L • 2 hari lalu</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-rose-600">Rp 38.000</p>
                      <span className="text-[9px] text-emerald-600 font-medium">Sudah Diingatkan</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">MD</div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Mas Dimas</p>
                        <p className="text-[10px] text-slate-400">Rokok & Kopi • Kemarin</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">Rp 25.000</p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">LUNAS</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onStartFree}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  + Catat Kasbon Baru (5 Detik)
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= METRICS BAR ================= */}
      <section className="py-10 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">18.500+</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Warung & Toko Terbantu</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600 tracking-tight">Rp 4,2 Miliar</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Kasbon Tertagih Lancar</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">84%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Penurunan Piutang Macet</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-amber-500 tracking-tight flex items-center justify-center gap-1">
                4.9 <Star className="w-5 h-5 fill-amber-500 text-amber-500 inline" />
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Rating Kepuasan Pemilik</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KOMPARASI (BUKU VS KASBONKU) ================= */}
      <section id="masalah" className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Komparasi Solusi</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Kenapa Warung Zaman Now Tinggalkan Buku Kertas?
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              Sudah bukan zamannya pusing karena catatan robek, coret-coretan hilang, atau rasa segan menagih tetangga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buku Kertas */}
            <div className="bg-rose-50/40 border border-rose-200/70 rounded-2xl p-7">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100/70 px-3 py-1 rounded-full">
                CARA LAMA (BUKU KERTAS)
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-4 mb-4">Sering Bikin Tekor Tanpa Disadari</h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>Buku sobek, basah ketumpahan kopi, atau hilang terselip.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>Sering lupa catat waktu antrean warung lagi padat-padatnya.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>Pekewuh dan tidak enak hati mau menagih ke tetangga sendiri.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span>Modal warung seret macet tanpa tahu total kasbon riil.</span>
                </li>
              </ul>
            </div>

            {/* KasbonKu */}
            <div className="bg-emerald-50/40 border-2 border-emerald-500 rounded-2xl p-7 shadow-lg shadow-emerald-500/5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                CARA CERDAS (KASBONKU)
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-4 mb-4">Semua Terdata, Hubungan Tetangga Tetap Mesra</h3>
              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Catatan tersimpan aman di cloud HP, ganti HP data tidak hilang.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Input kasbon super cepat cuma butuh 5 detik per transaksi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Kirim pengingat tagihan santun via WhatsApp tanpa canggung.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pantau limit kasbon per orang agar modal warung selalu sehat.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID FITUR ================= */}
      <section id="fitur" className="py-20 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Fitur Dirancang Untuk Warung</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Dirancang Khusus untuk Jam Sibuk Warung
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              Tidak perlu pusing menu ribet. Dibuat seringkas dan secepat mungkin untuk pedagang warung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Catat Kasbon 5 Detik</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cukup pilih nama pelanggan, ketik nominal atau pilih barang cepat, klik simpan tanpa hambatan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Pengingat Santun WhatsApp</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Format pesan disusun sopan dan bernada kekeluargaan agar pelanggan membayar tanpa tersinggung.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Pasang Batas Kasbon</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Atur limit kasbon per orang. Sistem memberi tanda peringatan ramah saat batas limit hampir tercapai.
              </p>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900">Rekap Mingguan & Laporan Kasbon Otomatis</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Lihat berapa uang warung yang masih di luar, tren pelunasan, dan pelanggan paling tertib setiap minggu.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="h-2 flex-1 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[84%]"></div>
                </div>
                <span className="text-xs font-bold text-emerald-700">84% Kasbon Tertagih Tepat Waktu</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Bisa Diakses Mode Offline</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sinyal warung lemot? Kasbon tetap bisa dicatat dan akan tersinkron otomatis saat sinyal kembali normal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SIMULASI KALKULATOR ================= */}
      <section id="simulasi" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/40">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Kalkulator Warung
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
                Simulasi Potensi Uang Kasbon yang Terselamatkan
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Hitung perkiraan perputaran modal warung Anda yang terselamatkan dari kasbon macet setiap bulannya.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Rata-rata Kasbon Harian Warung</span>
                    <span className="text-emerald-700 font-bold">{formatRupiah(kasbonHarian)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50000" 
                    max="1000000" 
                    step="25000" 
                    value={kasbonHarian}
                    onChange={(e) => setKasbonHarian(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                    <span>Jumlah Pelanggan yang Kasbon</span>
                    <span className="text-emerald-700 font-bold">{jumlahPelanggan} Orang</span>
                  </div>
                  <input 
                    type="range" 
                    min="3" 
                    max="50" 
                    step="1" 
                    value={jumlahPelanggan}
                    onChange={(e) => setJumlahPelanggan(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>
              </div>

              <div className="md:col-span-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Potensi Kasbon Mengendap</p>
                  <p className="text-xl font-extrabold text-slate-800">{formatRupiah(totalMengendap)}</p>
                </div>

                <div className="pt-3 border-t border-emerald-200/60">
                  <p className="text-xs text-emerald-900 font-bold">Estimasi Modal Terselamatkan</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {formatRupiah(estimasiHemat)} <span className="text-xs font-normal text-slate-600">/ bulan</span>
                  </p>
                </div>

                <button 
                  onClick={onStartFree}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  Selamatkan Modal Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STEP CARA PAKAI ================= */}
      <section id="cara-kerja" className="py-16 bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Langkah Mudah</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-12">
            Cuma Butuh 3 Menit untuk Memulai
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">1</div>
              <h4 className="font-bold text-slate-900 mb-2">Daftar Akun Warung</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Cukup masukkan nama warung & nomor WhatsApp Anda. Langsung aktif tanpa syarat kartu kredit.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">2</div>
              <h4 className="font-bold text-slate-900 mb-2">Catat Kasbon Pertama</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Ketik nama tetangga yang belanja dan nominal barang belanjaannya dalam 5 detik.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-4">3</div>
              <h4 className="font-bold text-slate-900 mb-2">Kirim Nota & Tagih Ramah</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Kirim pengingat atau bukti nota belanja santun lewat 1 kali klik ke chat WhatsApp tetangga.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONI ================= */}
      <section id="testimoni" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Kata Juragan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Kata Para Pemilik Warung yang Sudah Merasakan Hasilnya
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Dulu buku kasbon sering kecipratan minyak pas goreng pisang, tulisannya kabur. Sekarang tinggal buka HP, tetangga mau ngelak juga ada rinciannya lengkap di WA."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">BS</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Bu Siti Rodiah</p>
                  <p className="text-[10px] text-slate-400">Warung Berkah Sembako, Klaten</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Paling suka sama fitur pengingat WhatsApp santunnya. Nggak ada kata kasar, tetangga paham dan bayar tepat waktu tanpa musuhan."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">PH</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Pak Hendra</p>
                  <p className="text-[10px] text-slate-400">Toko Kelontong Berjaya, Bekasi</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Alhamdulillah modal buat kulakan rokok dan sembako nggak kegencet kasbon lagi. Begitu nyentuh limit langsung ada tandanya."
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">YM</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Mas Yahya</p>
                  <p className="text-[10px] text-slate-400">Warung Madura 24 Jam, Tangerang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Bantuan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Tanya Jawab Seputar KasbonKu
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 pt-2 border-t border-slate-100 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl shadow-emerald-700/20">
            <h2 className="text-2xl sm:text-4xl font-black max-w-2xl mx-auto leading-tight">
              Siap Bikin Pembukuan Warung Lebih Tertib & Rezeki Makin Lancar?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
              Bergabunglah dengan ribuan pemilik warung dan kelontong di seluruh Indonesia yang telah beralih dari buku kertas ke KasbonKu.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button 
                onClick={onStartFree}
                className="bg-white hover:bg-slate-100 text-emerald-800 font-bold px-7 py-3 rounded-xl transition text-xs sm:text-sm shadow-md cursor-pointer"
              >
                Coba Demo Tanpa Daftar
              </button>
              <button 
                onClick={onStartFree}
                className="bg-emerald-950/60 hover:bg-emerald-950 text-white font-bold px-7 py-3 rounded-xl border border-emerald-400/30 transition text-xs sm:text-sm cursor-pointer"
              >
                Mulai Pakai KasbonKu Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">K</div>
              <span className="text-base font-bold text-white">KasbonKu</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Aplikasi pencatatan kasbon dan piutang khusus pemilik warung tradisional dan kelontong modern di Indonesia.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold mb-3">Fitur Utama</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Quick Kasbon 5 Detik</a></li>
              <li><a href="#" className="hover:text-white transition">Pengingat WhatsApp Sopan</a></li>
              <li><a href="#" className="hover:text-white transition">Batas Limit Piutang</a></li>
              <li><a href="#" className="hover:text-white transition">Rekap Mingguan Warung</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-3">Bantuan & Komunitas</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Panduan Pemula</a></li>
              <li><a href="#" className="hover:text-white transition">Komunitas Juragan Warung</a></li>
              <li><a href="#" className="hover:text-white transition">Hubungi Bantuan CS</a></li>
              <li><a href="#" className="hover:text-white transition">Kebijakan Privasi</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-3">Dukungan</h5>
            <p className="leading-relaxed mb-3">Butuh panduan instalasi atau setting warung Anda?</p>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-2">
              <span>💬 Chat WhatsApp CS</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-12 pt-6 border-t border-slate-800 text-center text-slate-500">
          © 2026 KasbonKu Indonesia. Hak cipta dilindungi undang-undang.
        </div>
      </footer>

    </div>
  );
}