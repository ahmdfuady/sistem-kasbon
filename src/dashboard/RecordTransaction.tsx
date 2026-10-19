import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  UserPlus,
  ChevronDown,
  Search,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Check,
  Keyboard,
  X
} from 'lucide-react';

interface RecordTransactionProps {
  onBackToDashboard: () => void;
}

export default function RecordTransaction({ onBackToDashboard }: RecordTransactionProps) {
  const [transactionType, setTransactionType] = useState<'kasbon' | 'cicilan'>('kasbon');
  const [nominal, setNominal] = useState<number>(75000);
  const [itemsText, setItemsText] = useState('2 botol sirup Marjan & 1 renceng Kopi Hitam');
  const [tempoOption, setTempoOption] = useState<'3hari' | '1minggu' | 'gajian' | 'kalender'>('gajian');
  const [customerSearch, setCustomerSearch] = useState('');

  const utangSebelumnya = 125000;
  const batasKasbon = 300000;
  const totalUtangBaru = utangSebelumnya + (transactionType === 'kasbon' ? nominal : -nominal);
  const rasioBatas = Math.min(Math.round((totalUtangBaru / batasKasbon) * 100), 100);

  const addNominal = (amount: number) => {
    setNominal((prev) => prev + amount);
  };

  const handlePillClick = (item: string) => {
    setItemsText((prev) => (prev ? `${prev}, ${item}` : item));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Transaksi ${transactionType === 'kasbon' ? 'Kasbon' : 'Pembayaran'} sebesar Rp ${nominal.toLocaleString('id-ID')} untuk Pak Joko berhasil disimpan!`);
    onBackToDashboard();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200/60 gap-3">
        <div>
          <p className="text-[11px] font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
            <span>🏪 KASIR & KASBON WARUNG</span>
            <span>•</span>
            <span className="text-slate-400 font-semibold">BUKU CATATAN DIGITAL</span>
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Pencatatan Transaksi Kasbon & Pembayaran
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catat transaksi belanja kasbon baru pelanggan atau terima setoran cicilan dengan cepat dan teratur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white border border-slate-200 text-slate-600 text-[11px] font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Keyboard className="w-3.5 h-3.5 text-slate-400" />
            <span>Tekan <strong className="font-mono text-slate-800">Enter</strong> untuk simpan</span>
          </div>

          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Mode Kasir Aktif</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center max-w-md w-full shadow-inner">
          <button
            type="button"
            onClick={() => setTransactionType('kasbon')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              transactionType === 'kasbon'
                ? 'bg-rose-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📕 + Utang / Kasbon Baru</span>
          </button>

          <button
            type="button"
            onClick={() => setTransactionType('cicilan')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${
              transactionType === 'cicilan'
                ? 'bg-[#05603a] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>💵 Terima Bayar / Cicilan</span>
          </button>
        </div>
      </div>

      {/* Main Grid 2 Kolom Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= KOLOM KIRI (DATA KASBON) ================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          
          {/* 1. Pilih Pelanggan Warung */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-slate-800">
                Pilih Pelanggan Warung <span className="text-rose-500">*</span>
              </label>
              <button 
                type="button"
                onClick={() => alert('Fitur tambah pelanggan baru!')}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Pelanggan Baru</span>
              </button>
            </div>

            {/* Active Selected Customer Card */}
            <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-50/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-xs flex items-center justify-center">
                  PJ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">Pak Joko</span>
                    <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Bengkel Depan
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-600 font-bold mt-0.5">
                    Total Utang Sekarang: Rp {utangSebelumnya.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-800">
                <span>Ganti Pelanggan</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Search Input Pelanggan Lain */}
            <div className="relative mt-2">
              <span className="absolute left-3.5 top-2.5 text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Ketik nama pelanggan lain (misal: Bu Nanik, Mas Budi)..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
          </div>

          {/* 2. Nominal Kasbon Baru */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-slate-800">
                Nominal Kasbon Baru <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Pastikan hitungan warung pas</span>
            </div>

            {/* Input Nominal Besar */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 focus-within:bg-white transition">
              <span className="text-xl sm:text-2xl font-black text-slate-900 mr-2">Rp</span>
              <input
                type="number"
                value={nominal || ''}
                onChange={(e) => setNominal(Number(e.target.value))}
                className="w-full bg-transparent text-xl sm:text-2xl font-black text-rose-600 focus:outline-none tracking-tight"
              />
              {nominal > 0 && (
                <button
                  type="button"
                  onClick={() => setNominal(0)}
                  className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Pills Nominal */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-slate-400 mr-1 font-medium">Tambah Cepat:</span>
              {[5000, 10000, 20000, 50000, 100000, 200000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => addNominal(amt)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  +Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Tanggal Transaksi */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-2">
              Tanggal Transaksi
            </label>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <div>
                  <p className="font-bold text-slate-900">Hari ini, 14 Oktober 2024</p>
                  <p className="text-[10px] text-slate-400">Pukul 15:42 WIB (Waktu warung)</p>
                </div>
              </div>
              <button 
                type="button"
                className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
              >
                Ubah Tanggal
              </button>
            </div>
          </div>

          {/* 4. Janji Kapan Mau Dibayar? (Jatuh Tempo) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-slate-800">
                Janji Kapan Mau Dibayar? (Jatuh Tempo)
              </label>
              <span className="text-[11px] text-emerald-700 font-bold">Biar aman ditagih</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Opsi 1 */}
              <div
                onClick={() => setTempoOption('3hari')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  tempoOption === '3hari'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800">3 Hari Lagi</p>
                    <p className="text-[10px] text-slate-400">Kamis, 17 Okt 2024</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tempoOption === '3hari' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                  {tempoOption === '3hari' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

              {/* Opsi 2 */}
              <div
                onClick={() => setTempoOption('1minggu')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  tempoOption === '1minggu'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800">1 Minggu Lagi</p>
                    <p className="text-[10px] text-slate-400">Senin, 21 Okt 2024</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tempoOption === '1minggu' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                  {tempoOption === '1minggu' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

              {/* Opsi 3: Saat Gajian (Aktif di gambar) */}
              <div
                onClick={() => setTempoOption('gajian')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  tempoOption === 'gajian'
                    ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <Calendar className={`w-4 h-4 ${tempoOption === 'gajian' ? 'text-white' : 'text-slate-400'}`} />
                  <div>
                    <p className="font-bold">Saat Gajian / Akhir Bulan</p>
                    <p className={`text-[10px] ${tempoOption === 'gajian' ? 'text-emerald-200' : 'text-slate-400'}`}>Kamis, 31 Okt 2024</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tempoOption === 'gajian' ? 'border-white bg-white text-emerald-800' : 'border-slate-300'}`}>
                  {tempoOption === 'gajian' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

              {/* Opsi 4: Kalender */}
              <div
                onClick={() => setTempoOption('kalender')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  tempoOption === 'kalender'
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-800">Pilih Kalender</p>
                    <p className="text-[10px] text-slate-400">Tentukan tanggal sendiri</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${tempoOption === 'kalender' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                  {tempoOption === 'kalender' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ================= KOLOM KANAN (RINCIAN BARANG & PREVIEW) ================= */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Box Input Rincian Barang */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800">
                Rincian Barang yang Diambil
              </label>
              <span className="text-[11px] text-slate-400">Catatan barang</span>
            </div>

            <textarea
              rows={3}
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="Contoh: 2 botol sirup Marjan & 1 renceng Kopi Hitam"
              className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />

            {/* Quick Pills Barang Sering Dikasbon */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold mb-1.5">Barang sering kasbon:</p>
              <div className="flex flex-wrap gap-1.5">
                {['+ Gas 3kg', '+ Galon Air', '+ Dus Mie Instan', '+ Minyak Goreng 2L', '+ Telur 1kg'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handlePillClick(item.replace('+ ', ''))}
                    className="bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-800 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-indigo-100 transition cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Card: Ringkasan Catatan Baru */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700">📋</span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Ringkasan Catatan Baru</h3>
              </div>
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Kasbon Bertambah
              </span>
            </div>

            {/* Profil Pelanggan Pill */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                👤
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Pak Joko</p>
                <p className="text-[10px] text-slate-400">Pelanggan Tetap (RT 03 / RW 02)</p>
              </div>
            </div>

            {/* Rincian Angka */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Utang Sebelumnya:</span>
                <span className="font-bold text-slate-800">Rp {utangSebelumnya.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Tambahan Kasbon Ini:</span>
                <span className="font-bold text-rose-600">+Rp {nominal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Rasio Batas Kasbon Progress Bar */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400">Rasio Batas Kasbon (Maks Rp 300.000)</span>
                <span className="text-rose-600">{rasioBatas}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${rasioBatas}%` }}
                ></div>
              </div>
            </div>

            {/* Total Utang Baru Highlight */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-900">Total Utang Baru:</p>
                <p className="text-[10px] text-slate-400">Akan tercatat di buku Pak Joko</p>
              </div>
              <p className="text-2xl font-black text-rose-600">
                Rp {totalUtangBaru.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 text-[11px]">Jatuh Tempo Pembayaran:</span>
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <span>🗓️ Akhir Bulan (31 Okt 2024)</span>
              </span>
            </div>

            {/* Box WA Info Otomatis */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Pencatatan otomatis masuk ke buku kasbon <strong>Pak Joko</strong>. Anda dapat langsung mengirim nota tagihan via <strong>manual hyperlink wa.me</strong> dari nomor WhatsApp pribadi warung Anda tanpa bot API.
                </span>
              </div>

              <a 
                href="#kirim-nota"
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[10px] pt-1"
              >
                <span>💬 Buka link wa.me kirim nota belanja ke Pak Joko setelah simpan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Actions Form */}
        <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>← Batal / Kembali</span>
            </button>
            <button
              type="button"
              onClick={() => { setNominal(0); setItemsText(''); }}
              className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition cursor-pointer"
              title="Reset Form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-[#05603a] hover:bg-[#044e2f] text-white font-black px-8 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Catatan Kasbon (Enter)</span>
          </button>
        </div>

      </form>

      {/* ================= 3 KARTU STAT DI BAWAH ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base">
            📈
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">Total Kasbon Beredar Hari Ini</p>
            <p className="text-base font-black text-slate-900 mt-0.5">Rp 1.450.000</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">
            💵
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">Setoran Masuk Hari Ini</p>
            <p className="text-base font-black text-slate-900 mt-0.5">Rp 380.000</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-base">
            👥
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">Pelanggan Jatuh Tempo Minggu Ini</p>
            <p className="text-base font-black text-slate-900 mt-0.5">6 Orang</p>
          </div>
        </div>

      </div>

    </div>
  );
}