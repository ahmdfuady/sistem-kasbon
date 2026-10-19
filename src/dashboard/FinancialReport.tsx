import React, { useState } from 'react';
import {
  Calendar,
  Download,
  FileSpreadsheet,
  ChevronDown,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  Share2,
  TrendingUp,
  Wallet,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function FinancialReport() {
  const [activeTab, setActiveTab] = useState<'semua' | 'pelunasan' | 'kasbon'>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      
      {/* Top Header: Badge, Title, Filter Periode & Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-2 border-b border-slate-200/60 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/80 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>REKAPITULASI USAHA • Pembaruan otomatis 10 menit lalu</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Laporan Keuangan & Piutang Warung
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi kasbon tertagih, mutasi perputaran modal dagang, dan analisa kelancaran bayar warga tetangga.
          </p>
        </div>

        {/* Action Buttons: Filter Bulan & Ekspor */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm cursor-pointer transition">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Bulan Ini – Oktober 2024</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh PDF</span>
          </button>

          <button className="bg-[#05603a] hover:bg-[#044e2f] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ekspor Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* ================= 4 KARTU METRIK UTAMA ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Total Kasbon Beredar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">TOTAL KASBON BEREDAR</p>
              <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                Rp 1.450.000
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
            <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2 py-0.5 rounded">
              18 Pelanggan
            </span>
            <span className="text-[11px] text-slate-400">8 orang aktif ada kasbon</span>
          </div>
        </div>

        {/* 2. Kas Pelunasan Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">KAS PELUNASAN MASUK</p>
              <p className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">
                Rp 2.850.000
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-200">
              ↗ +18%
            </span>
            <span className="text-[11px] text-slate-400">24 kali cicil/lunas</span>
          </div>
        </div>

        {/* 3. Jatuh Tempo / Tertahan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">JATUH TEMPO / TERTAHAN</p>
              <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">
                Rp 630.000
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
            <span className="bg-rose-50 text-rose-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-rose-200">
              Perlu Disapa
            </span>
            <span className="text-[11px] text-slate-400">3 warga nunggak &gt;3 hari</span>
          </div>
        </div>

        {/* 4. Modal Terselamatkan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">MODAL TERSELAMATKAN</p>
              <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                Rp 945.000
              </p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mr-2">
                <div className="bg-emerald-600 h-full w-[84%] rounded-full"></div>
              </div>
              <span className="text-emerald-700 whitespace-nowrap">84% Lancar</span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= SECTION TENGAH: GRAFIK & KOMPOSISI BARANG ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Arus Mutasi Kasbon 7 Hari Terakhir */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Arus Mutasi Kasbon 7 Hari Terakhir</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Perbandingan uang belanjaan kasbon keluar vs uang bayar cicilan masuk
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#064e3b]"></span> Kas Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-600"></span> Kasbon Baru
              </span>
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="pt-4 pb-2">
            <div className="relative h-44 flex items-end justify-between gap-2 px-2 text-[10px] font-bold text-slate-400">
              
              {/* Garis Grid Horizontal */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-slate-300">
                <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>600rb</span></div>
                <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>400rb</span></div>
                <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>200rb</span></div>
                <div className="border-b border-slate-200 w-full flex justify-between"><span>0</span></div>
              </div>

              {/* Day 1: Sen */}
              <div className="flex-1 flex flex-col items-center gap-1 z-10">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm h-[30%]"></div>
                  <div className="w-3 sm:w-4 bg-rose-600 rounded-t-sm h-[20%]"></div>
                </div>
                <span>Sen</span>
              </div>

              {/* Day 2: Sel */}
              <div className="flex-1 flex flex-col items-center gap-1 z-10">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm h-[60%]"></div>
                  <div className="w-3 sm:w-4 bg-rose-600 rounded-t-sm h-[18%]"></div>
                </div>
                <span>Sel</span>
              </div>

              {/* Day 3: Rab */}
              <div className="flex-1 flex flex-col items-center gap-1 z-10">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm h-[45%]"></div>
                  <div className="w-3 sm:w-4 bg-rose-600 rounded-t-sm h-[28%]"></div>
                </div>
                <span>Rab</span>
              </div>

              {/* Day 4: Kam */}
              <div className="flex-1 flex flex-col items-center gap-1 z-10">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm h-[75%]"></div>
                  <div className="w-3 sm:w-4 bg-rose-600 rounded-t-sm h-[18%]"></div>
                </div>
                <span>Kam</span>
              </div>

              {/* Day 5: Jum */}
              <div className="flex-1 flex flex-col items-center gap-1 z-10">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm h-[88%]"></div>
                  <div className="w-3 sm:w-4 bg-rose-600 rounded-t-sm h-[22%]"></div>
                </div>
                <span>Jum</span>
              </div>

              {/* Day 6: Sab */}
              <div className="flex-1 flex flex-col items-center gap-1 z-10">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm h-[50%]"></div>
                  <div className="w-3 sm:w-4 bg-rose-600 rounded-t-sm h-[40%]"></div>
                </div>
                <span>Sab</span>
              </div>

              {/* Day 7: Hari Ini */}
              <div className="flex-1 flex flex-col items-center gap-1 z-10">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm h-[95%]"></div>
                  <div className="w-3 sm:w-4 bg-rose-600 rounded-t-sm h-[25%]"></div>
                </div>
                <span className="text-emerald-700 font-extrabold">Hari Ini</span>
              </div>

            </div>
          </div>

          {/* Banner Surplus Kas */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Surplus Kas Pelunasan: <strong className="text-emerald-800 font-black">+Rp 1.400.000</strong> lebih banyak daripada kasbon baru minggu ini.</span>
            </div>
            <span className="bg-white text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
              ARUS SEHAT
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Barang Kasbon Terbanyak */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Barang Kasbon Terbanyak</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Komposisi stok sembako yang paling sering ditangguhkan pembayarannya.</p>
            </div>
            <span className="text-slate-400 text-lg">📦</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Item 1 */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Tabung Gas LPG 3kg
                </span>
                <span>Rp 520.000 <strong className="text-slate-900 ml-1">35%</strong></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[35%] rounded-full"></div>
              </div>
            </div>

            {/* Item 2 */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Beras Medium 5kg
                </span>
                <span>Rp 410.000 <strong className="text-slate-900 ml-1">28%</strong></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[28%] rounded-full"></div>
              </div>
            </div>

            {/* Item 3 */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Minyak Goreng Sawit 2L
                </span>
                <span>Rp 295.000 <strong className="text-slate-900 ml-1">20%</strong></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[20%] rounded-full"></div>
              </div>
            </div>

            {/* Item 4 */}
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Rokok & Kopi Renceng
                </span>
                <span>Rp 225.000 <strong className="text-slate-900 ml-1">17%</strong></span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full w-[17%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
            <span className="text-emerald-700">💡</span>
            <span><strong>Perhatian Juragan:</strong> Gas LPG dan Beras menyumbang 63% kasbon. Pastikan pembeli melunasi sebelum mengambil tabung gas berikutnya.</span>
          </div>
        </div>

      </div>

      {/* ================= SECTION BAWAH: TABEL REKAPITULASI TRANSAKSI ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        
        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          
          {/* Tabs Filter */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab('semua')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'semua' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Semua Rekap Harian (38)
            </button>
            <button
              onClick={() => setActiveTab('pelunasan')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'pelunasan' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Pelunasan Masuk (24)
            </button>
            <button
              onClick={() => setActiveTab('kasbon')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'kasbon' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              Kasbon Baru (14)
            </button>
          </div>

          {/* Search & Cetak */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Saring nama pelanggan..."
                className="bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>

            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Cetak Rekap</span>
            </button>
          </div>

        </div>

        {/* Tabel Data Mutasi */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3 font-semibold">WAKTU TRANSAKSI</th>
                <th className="pb-3 font-semibold">PELANGGAN & RINCIAN BELANJA</th>
                <th className="pb-3 font-semibold">JENIS MUTASI</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 font-semibold text-right">KASBON BARU (-)</th>
                <th className="pb-3 font-semibold text-right">PELUNASAN MASUK (+)</th>
                <th className="pb-3 font-semibold text-right">SALDO KASBON BERJALAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              
              {/* Row 1: Pak Joko */}
              <tr>
                <td className="py-3.5">
                  <p className="font-bold text-slate-800">Hari Ini, 20 Okt</p>
                  <p className="text-[10px] text-slate-400">14:25 WIB</p>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-[10px] flex items-center justify-center shrink-0">PJ</div>
                    <div>
                      <p className="font-bold text-slate-900">Pak Joko (RT 03)</p>
                      <p className="text-[10px] text-slate-400">Pelunasan kontan rokok & gula</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border-2 border-emerald-600"></span> Kas Masuk
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Lunas Tunai
                  </span>
                </td>
                <td className="py-3.5 text-right text-slate-300">-</td>
                <td className="py-3.5 text-right font-black text-emerald-600">+Rp 50.000</td>
                <td className="py-3.5 text-right font-bold text-slate-800">Rp 0</td>
              </tr>

              {/* Row 2: Mbak Sri Warteg */}
              <tr>
                <td className="py-3.5">
                  <p className="font-bold text-slate-800">Hari Ini, 20 Okt</p>
                  <p className="text-[10px] text-slate-400">11:10 WIB</p>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-black text-[10px] flex items-center justify-center shrink-0">MS</div>
                    <div>
                      <p className="font-bold text-slate-900">Mbak Sri Warteg</p>
                      <p className="text-[10px] text-slate-400">Minyak Goreng 2L (1 pouch)</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5">
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border-2 border-rose-600"></span> Kasbon Baru
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Tempo 3 Hari
                  </span>
                </td>
                <td className="py-3.5 text-right font-black text-rose-600">-Rp 34.000</td>
                <td className="py-3.5 text-right text-slate-300">-</td>
                <td className="py-3.5 text-right font-bold text-rose-600">Rp 184.000</td>
              </tr>

              {/* Row 3: Bu Anik Gurih */}
              <tr>
                <td className="py-3.5">
                  <p className="font-bold text-slate-800">Hari Ini, 20 Okt</p>
                  <p className="text-[10px] text-slate-400">08:45 WIB</p>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] flex items-center justify-center shrink-0">BA</div>
                    <div>
                      <p className="font-bold text-slate-900">Bu Anik Gurih</p>
                      <p className="text-[10px] text-slate-400">Pelunasan Beras Medium 5kg via QRIS</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border-2 border-emerald-600"></span> Kas Masuk
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Lunas QRIS
                  </span>
                </td>
                <td className="py-3.5 text-right text-slate-300">-</td>
                <td className="py-3.5 text-right font-black text-emerald-600">+Rp 62.000</td>
                <td className="py-3.5 text-right font-bold text-slate-800">Rp 0</td>
              </tr>

              {/* Row 4: Mas Dimas Bengkel */}
              <tr>
                <td className="py-3.5">
                  <p className="font-bold text-slate-800">Kemarin, 19 Okt</p>
                  <p className="text-[10px] text-slate-400">19:30 WIB</p>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-black text-[10px] flex items-center justify-center shrink-0">MD</div>
                    <div>
                      <p className="font-bold text-slate-900">Mas Dimas Bengkel</p>
                      <p className="text-[10px] text-slate-400">Cicil Kasbon Tabung Gas LPG (1 dari 2)</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border-2 border-emerald-600"></span> Kas Masuk
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Cicilan 50%
                  </span>
                </td>
                <td className="py-3.5 text-right text-slate-300">-</td>
                <td className="py-3.5 text-right font-black text-emerald-600">+Rp 22.000</td>
                <td className="py-3.5 text-right font-bold text-rose-600">Sisa Rp 22.000</td>
              </tr>

              {/* Row 5: Bu RT Endang */}
              <tr>
                <td className="py-3.5">
                  <p className="font-bold text-slate-800">Kemarin, 19 Okt</p>
                  <p className="text-[10px] text-slate-400">16:15 WIB</p>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-black text-[10px] flex items-center justify-center shrink-0">BE</div>
                    <div>
                      <p className="font-bold text-slate-900">Bu RT Endang</p>
                      <p className="text-[10px] text-slate-400">Telur 1kg, Bumbu Dapur, Kecap Manis</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5">
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border-2 border-rose-600"></span> Kasbon Baru
                  </span>
                </td>
                <td className="py-3.5">
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Tempo 5 Hari
                  </span>
                </td>
                <td className="py-3.5 text-right font-black text-rose-600">-Rp 45.000</td>
                <td className="py-3.5 text-right text-slate-300">-</td>
                <td className="py-3.5 text-right font-bold text-rose-600">Rp 45.000</td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Pagination Table */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <span>Menampilkan 5 dari 38 mutasi kasbon bulan Oktober 2024</span>
          
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#05603a] text-white flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              2
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              3
            </button>
            <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ================= BANNER BAWAH: TIPS JURAGAN BU SITI ================= */}
      <div className="bg-gradient-to-r from-[#064e3b] to-[#043d2e] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 text-xl shrink-0">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-bold mb-1">
              <span>TIPS KEUANGAN JURAGAN BU SITI</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                Skor Kasbon: SEHAT
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black tracking-tight">
              Rasio Kasbon Warung Anda Terkendali di 12% Modal
            </h4>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
              Perputaran modal Anda sangat baik. Agar arus kas kulakan tetap aman, pertahankan batas kasbon tabung gas 3kg maksimal <strong>1 tabung per keluarga</strong> dan pastikan lunas sebelum pengambilan berikutnya.
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert('Rekapitulasi keuangan siap dibagikan via WhatsApp atau dicetak!')}
          className="bg-white hover:bg-slate-50 text-emerald-900 font-black text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap transition cursor-pointer shrink-0"
        >
          <Share2 className="w-4 h-4 text-emerald-700" />
          <span>Bagikan Rekap ke Pembukuan</span>
        </button>
      </div>

    </div>
  );
}