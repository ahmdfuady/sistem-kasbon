import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  PlusCircle,
  CheckCircle2,
  ExternalLink,
  Printer,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Copy,
  Edit2,
  Lock,
  ShoppingBag,
  TrendingUp,
  Check,
  Share2
} from 'lucide-react';

interface CustomerDetailProps {
  onBackToDashboard: () => void;
}

export default function CustomerDetail({ onBackToDashboard }: CustomerDetailProps) {
  const [filterTab, setFilterTab] = useState<'semua' | 'kasbon' | 'cicilan'>('semua');
  const [copiedLink, setCopiedLink] = useState(false);

  const waMessage = `Halo Pak Joko, ini Bu Siti dari Warung Barokah. Mengingatkan kasbon tanggal 10 Okt sebesar Rp 350.000. Mohon info jika ingin titip cicilan nggih. Terima kasih banyak & sehat selalu sekeluarga 🙏`;
  const waLink = `wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${waLink}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500">
          <button 
            onClick={onBackToDashboard}
            className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Pelanggan</span>
          </button>
          <span>•</span>
          <span>Buku Pelanggan</span>
          <span>›</span>
          <span className="font-bold text-slate-800">Pak Joko (Bengkel Depan)</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Buku diperbarui hari ini, 15:42 WIB</span>
        </div>
      </div>

      {/* ================= PROFILE CARD HEADER ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Info Pelanggan */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-800 font-black text-xl flex items-center justify-center shrink-0">
                PJ
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-sm">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Pak Joko (Bengkel Motor Sebelah)
                </h2>
                <span className="bg-slate-100 text-slate-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                  ID: #PLG-0142
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>0812-3456-7890</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Samping Bengkel Motor Barokah, RT 02/04</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pelanggan sejak Jan 2024</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sisa Kasbon & Progress */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
            
            {/* Box Merah: Total Sisa Kasbon */}
            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">TOTAL SISA KASBON</span>
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span>🚨 Telat 5 Hari</span>
                </span>
              </div>
              <p className="text-2xl font-black text-rose-600">Rp 350.000</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span>⏱️ Jatuh tempo: 10 Okt 2024</span>
              </p>
            </div>

            {/* Box Abu: Total Riwayat Kasbon */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[200px]">
              <p className="text-[10px] font-bold text-slate-400">Total Seluruh Riwayat Kasbon</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">Rp 500.000</p>
              
              <div className="mt-2 space-y-1">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[30%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-500">
                  <span className="text-emerald-700 font-bold">Sudah Terbayar</span> Rp 150.000 (30%)
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Action Button Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <button className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Kasbon Baru</span>
          </button>

          <button className="bg-[#05603a] hover:bg-[#044e2f] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
            <span>+ Terima Cicilan / Bayar</span>
          </button>

          <button 
            onClick={() => window.open(`https://${waLink}`, '_blank')}
            className="bg-[#25d366] hover:bg-[#20ba59] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka wa.me Pak Joko</span>
          </button>

          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer">
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Cetak Rincian Kasbon</span>
          </button>

          <button className="w-9 h-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center transition cursor-pointer">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= MAIN 2 KOLOM ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= KOLOM KIRI (RIWAYAT TRANSAKSI) ================= */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Header Riwayat & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Riwayat Transaksi Lengkap</h3>
                  <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full">
                    4 Catatan
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Buku catatan rincian hutang dan cicilan Pak Joko
                </p>
              </div>

              {/* Tabs Filter */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
                <button
                  onClick={() => setFilterTab('semua')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterTab === 'semua' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterTab('kasbon')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterTab === 'kasbon' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  Kasbon Baru
                </button>
                <button
                  onClick={() => setFilterTab('cicilan')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    filterTab === 'cicilan' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
                  }`}
                >
                  Cicilan / Bayar
                </button>
              </div>
            </div>

            {/* List Item Transaksi */}
            <div className="space-y-3">
              
              {/* Item 1: Kasbon Baru (10 Okt) */}
              <div className="p-4 rounded-xl border border-rose-100 bg-white hover:border-rose-200 transition flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">Kasbon Baru</span>
                      <span className="text-[11px] text-slate-400">• 10 Okt 2024, 16:30 WIB</span>
                    </div>
                    <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-100">
                      ⏱️ Belum Lunas (Tempo 10 Okt)
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      Rokok Gudang Garam 2 bks & Kopi Hitam sachet
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      ↳ Catatan: Diambil anaknya waktu pulang sekolah
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-rose-600">+Rp 100.000</p>
                  <p className="text-[10px] text-slate-400">Sisa: Rp 350.000</p>
                </div>
              </div>

              {/* Item 2: Cicilan Masuk (05 Okt) */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-white hover:border-emerald-200 transition flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">Cicilan Masuk</span>
                      <span className="text-[11px] text-slate-400">• 05 Okt 2024, 09:15 WIB</span>
                    </div>
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                      ✓ Diterima Bu Siti Langsung
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      Pembayaran tunai di toko pagi hari sebelum buka bengkel
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      🧾 Kwitansi No: #KWT-0941 • Tunai Rp 150.000
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-emerald-600">-Rp 150.000</p>
                  <p className="text-[10px] text-slate-400">Sisa: Rp 250.000</p>
                </div>
              </div>

              {/* Item 3: Kasbon Baru (28 Sep) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">Kasbon Baru</span>
                      <span className="text-[11px] text-slate-400">• 28 Sep 2024, 11:20 WIB</span>
                    </div>
                    <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                      Sebagian Lunas (Tersisa Rp 250rb)
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      Beras Rojolele 5kg, Telur Ayam 1kg & Minyak Goreng Tropical 2L
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Belanja bahan bulanan keluarga & warung makan bengkel
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-rose-600">+Rp 400.000</p>
                  <p className="text-[10px] text-slate-400">Sisa: Rp 400.000</p>
                </div>
              </div>

              {/* Item 4: Cicilan Masuk (15 Sep) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">Cicilan Masuk</span>
                      <span className="text-[11px] text-slate-400">• 15 Sep 2024, 14:00 WIB</span>
                    </div>
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                      ✓ Lunas Periode Awal
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      Pelunasan kasbon awal bulan September
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Uang pas pecahan Rp 50.000 x 2
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-emerald-600">-Rp 100.000</p>
                  <p className="text-[10px] text-slate-400">Sisa: Rp 0 (Sebelumnya)</p>
                </div>
              </div>

            </div>

            {/* Pagination / Total info */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan 4 dari total 4 transaksi kasbon</span>
              <button className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Salinan PDF</span>
              </button>
            </div>

          </div>

          {/* Pola Kasbon Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Pola Kasbon Pak Joko</h4>
                <p className="text-[11px] text-slate-400">Rata-rata pelunasan: 12 hari kerja sehabis akhir pekan</p>
              </div>
            </div>

            {/* Simple Graphic Curve */}
            <svg className="w-24 h-8 text-emerald-600" viewBox="0 0 100 30" fill="none">
              <path d="M0 20 Q 25 5, 50 15 T 90 10" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="90" cy="10" r="3" fill="#dc2626" />
            </svg>
          </div>

        </div>

        {/* ================= KOLOM KANAN (SIDEBAR DETAILS) ================= */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. Box Pengingat WhatsApp */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 text-lg">💬</span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Pengingat WhatsApp</h3>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                Gratis Tanpa Bot API
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Klik tombol di bawah untuk langsung membuka chat WhatsApp pribadi Anda ke nomor Pak Joko (0812-3456-7890) dengan draf pesan kasbon yang sudah terangkai rapi via tautan wa.me.
            </p>

            {/* Bubble WA Chat Preview */}
            <div className="bg-[#e7f8ee] border border-emerald-100/90 rounded-2xl p-3.5 relative text-xs text-slate-800 leading-relaxed">
              <p className="text-[11px]">{waMessage}</p>
              <div className="text-right text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                <span>15:43</span>
                <span className="text-emerald-600 font-bold">✓✓</span>
              </div>
            </div>

            {/* Link Preview box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="truncate max-w-[200px]">{waLink}</span>
              <button 
                onClick={handleCopyLink}
                className="text-emerald-700 font-bold hover:underline shrink-0 ml-2 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>
            </div>

            {/* Tombol Hijau Besar */}
            <button 
              onClick={() => window.open(`https://${waLink}`, '_blank')}
              className="w-full bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Link wa.me di WhatsApp</span>
            </button>

            <p className="text-center text-[10px] text-slate-400 leading-tight">
              100% Aman & Gratis: Dikirim langsung dari HP/WhatsApp pemilik warung tanpa perantara bot API.
            </p>
          </div>

          {/* 2. Catatan Khusus Pelanggan */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700">📝</span>
                <h4 className="font-extrabold text-xs text-slate-900">Catatan Khusus Pelanggan</h4>
              </div>
              <button className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer">
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="bg-slate-50 border-l-4 border-emerald-600 p-3 rounded-r-xl text-xs text-slate-700 leading-relaxed italic">
              "Pak Joko biasanya bayar hari <strong>Sabtu sore</strong> sehabis bengkel tutup ramai servis pelanggan. Kalau belum sempat ke toko, biasanya titip uang lewat Mas Bayu (mekanik)."
            </div>

            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Hanya terlihat oleh pengelola warung (Bu Siti)</span>
            </p>
          </div>

          {/* 3. Barang yang Sering Diambil */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700">📦</span>
                <h4 className="font-extrabold text-xs text-slate-900">Barang yang Sering Diambil</h4>
              </div>
              <span className="text-[10px] font-bold text-slate-400">3 Teratas</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-800 font-extrabold text-[10px] flex items-center justify-center">1</span>
                  <div>
                    <p className="font-bold text-slate-800">Tabung Gas LPG 3kg</p>
                    <p className="text-[10px] text-slate-400">Frekuensi: 6x transaksi</p>
                  </div>
                </div>
                <span className="font-bold text-slate-800">Rp 22.000</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center justify-center">2</span>
                  <div>
                    <p className="font-bold text-slate-800">Kopi Kapal Api Renceng</p>
                    <p className="text-[10px] text-slate-400">Frekuensi: 5x transaksi</p>
                  </div>
                </div>
                <span className="font-bold text-slate-800">Rp 15.000</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[10px] flex items-center justify-center">3</span>
                  <div>
                    <p className="font-bold text-slate-800">Rokok Surya 12</p>
                    <p className="text-[10px] text-slate-400">Frekuensi: 4x transaksi</p>
                  </div>
                </div>
                <span className="font-bold text-slate-800">Rp 26.500</span>
              </div>
            </div>
          </div>

          {/* 4. Footer Cloud Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-slate-600">
            <span className="text-emerald-700 text-base">☁️</span>
            <div>
              <p className="font-bold text-[11px] text-slate-800">Data Kasbon Terenkripsi & Aman</p>
              <p className="text-[10px] text-slate-400">Tersinkronisasi otomatis dengan cadangan server cloud warung.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}