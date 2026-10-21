import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar, Clock, UserPlus, ChevronDown, Search, CheckCircle2,
  ExternalLink, RotateCcw, Check, Keyboard, X, Copy, Lock
} from 'lucide-react';
import { createTransaksi, listSaldo, listTransaksi, nextNoKwitansi } from '../lib/api';
import type { SaldoPelanggan, TempoOption } from '../lib/types';
import {
  buildKwitansi, buildNotaKasbon, formatAngkaInput, parseAngka, buildWaLink, formatRupiah, formatTanggal, formatTanggalHari,
  hitungJatuhTempo, initials, labelMetode, todayISO
} from '../lib/format';
import { daftarTempoDalam, startOfDay, sum, totalPiutang } from '../lib/analytics';
import { useAuth } from '../context/AuthContext';
import { validasiTransaksi } from '../validation';
import AddCustomerModal from '../components/AddCustomerModal';

interface RecordTransactionProps {
  onBackToDashboard: () => void;
  initialPelangganId?: string;
  initialJenis?: 'kasbon' | 'cicilan';
  onOpenCustomer?: (id: string) => void;
}

interface Hasil {
  jenis: 'kasbon' | 'cicilan';
  nama: string;
  whatsapp: string | null;
  teks: string;
  nominal: number;
  sisa: number;
}

export default function RecordTransaction({ onBackToDashboard, initialPelangganId, initialJenis, onOpenCustomer }: RecordTransactionProps) {
  const { warung } = useAuth();

  const [transactionType, setTransactionType] = useState<'kasbon' | 'cicilan'>(initialJenis || 'kasbon');
  const [nominal, setNominal] = useState<number>(0);
  const [itemsText, setItemsText] = useState('');
  const [catatanKasbon, setCatatanKasbon] = useState('');
  const [tempoOption, setTempoOption] = useState<TempoOption>('gajian');
  const [kalenderDate, setKalenderDate] = useState('');
  const [metode, setMetode] = useState<'tunai' | 'transfer' | 'qris'>('tunai');
  const [tanggal, setTanggal] = useState(todayISO());
  const [showTanggal, setShowTanggal] = useState(false);

  const [customerSearch, setCustomerSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [copied, setCopied] = useState(false);

  const [customers, setCustomers] = useState<SaldoPelanggan[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialPelangganId ?? null);
  const [setoranHariIni, setSetoranHariIni] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const loadCustomers = async (selectId?: string) => {
    try {
      const data = await listSaldo();
      setCustomers(data);
      if (selectId) setSelectedId(selectId);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat daftar pelanggan.');
    }
  };

  useEffect(() => {
    loadCustomers();
    listTransaksi({ fromISO: startOfDay().toISOString() })
      .then((t) => setSetoranHariIni(sum(t, 'cicilan')))
      .catch(() => undefined);
  }, []);

  const selectedPelanggan = useMemo(
    () => customers.find((c) => c.pelanggan_id === selectedId) ?? null,
    [customers, selectedId]
  );

  // ---------------------------------------------------------- Kalkulasi
  const baseDate = new Date(tanggal + 'T12:00:00');
  const utangSebelumnya = Math.max(selectedPelanggan?.sisa_utang || 0, 0);
  const batasKasbon = selectedPelanggan?.batas_kasbon ?? warung?.plafon_default ?? null;
  const totalUtangBaru = Math.max(utangSebelumnya + (transactionType === 'kasbon' ? nominal : -nominal), 0);
  const jatuhTempo = hitungJatuhTempo(tempoOption, kalenderDate, baseDate);

  let rasioBatas = 0;
  if (batasKasbon && batasKasbon > 0) rasioBatas = Math.min(Math.round((totalUtangBaru / batasKasbon) * 100), 100);

  const terkunci = !!warung?.kunci_kasbon && !!selectedPelanggan && selectedPelanggan.sisa_utang > 0 && selectedPelanggan.hari_telat > 7;

  const q = customerSearch.trim().toLowerCase();
  const filteredCustomers = customers
    .filter((c) => !q || c.nama.toLowerCase().includes(q) || c.kode.toLowerCase().includes(q))
    .slice(0, 8);

  const stat = {
    beredar: totalPiutang(customers),
    tempoMinggu: daftarTempoDalam(customers, 7).length,
  };

  const opsiTempo: { id: TempoOption; label: string; sub: string; icon: any }[] = [
    { id: '3hari', label: '3 Hari Lagi', sub: formatTanggalHari(hitungJatuhTempo('3hari', undefined, baseDate)), icon: Clock },
    { id: '1minggu', label: '1 Minggu Lagi', sub: formatTanggalHari(hitungJatuhTempo('1minggu', undefined, baseDate)), icon: Calendar },
    { id: 'gajian', label: 'Saat Gajian / Akhir Bulan', sub: formatTanggalHari(hitungJatuhTempo('gajian', undefined, baseDate)), icon: Calendar },
    { id: 'kalender', label: 'Pilih Kalender', sub: kalenderDate ? formatTanggalHari(kalenderDate) : 'Tentukan tanggal sendiri', icon: Calendar },
  ];

  // ---------------------------------------------------------- Aksi
  const addNominal = (amount: number) => setNominal((prev) => prev + amount);
  const handlePillClick = (item: string) => setItemsText((prev) => (prev ? `${prev}, ${item}` : item));
  const reset = () => {
    setNominal(0);
    setItemsText('');
    setCatatanKasbon('');
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const errValidasi = validasiTransaksi({
      pelangganDipilih: !!selectedPelanggan,
      jenis: transactionType,
      nominal,
      utangSebelumnya,
      batasKasbon,
      terkunci,
      tempoOption,
      kalenderDate,
    });
    if (errValidasi) return setError(errValidasi);
    if (!selectedPelanggan) return; // sudah dicek di atas (untuk TypeScript)

    // Tanggal lampau: pakai tanggal pilihan + jam sekarang
    let created_at: string | undefined;
    if (tanggal !== todayISO()) {
      const n = new Date();
      const [y, m, d] = tanggal.split('-').map(Number);
      created_at = new Date(y, m - 1, d, n.getHours(), n.getMinutes(), n.getSeconds()).toISOString();
    }

    setIsSaving(true);
    try {
      let noKwitansi: string | null = null;
      if (transactionType === 'cicilan') noKwitansi = await nextNoKwitansi();

      await createTransaksi({
        pelanggan_id: selectedPelanggan.pelanggan_id,
        jenis: transactionType,
        nominal,
        barang: transactionType === 'kasbon' ? itemsText.trim() || null : null,
        catatan: transactionType === 'cicilan' ? itemsText.trim() || null : catatanKasbon.trim() || null,
        tempo_option: transactionType === 'kasbon' ? tempoOption : null,
        jatuh_tempo: transactionType === 'kasbon' ? jatuhTempo : null,
        metode_bayar: transactionType === 'cicilan' ? metode : null,
        no_kwitansi: noKwitansi,
        ...(created_at ? { created_at } : {}),
      });

      const teks =
        transactionType === 'kasbon'
          ? buildNotaKasbon({
              namaWarga: selectedPelanggan.nama,
              namaWarung: warung?.nama_warung ?? '',
              barang: itemsText.trim(),
              nominal,
              totalUtang: totalUtangBaru,
              jatuhTempo,
              catatanStruk: warung?.catatan_struk,
            })
          : buildKwitansi({
              namaWarga: selectedPelanggan.nama,
              namaWarung: warung?.nama_warung ?? '',
              noKwitansi,
              nominal,
              sisaUtang: totalUtangBaru,
              metode,
              catatanStruk: warung?.catatan_struk,
            });

      setHasil({
        jenis: transactionType,
        nama: selectedPelanggan.nama,
        whatsapp: selectedPelanggan.whatsapp,
        teks,
        nominal,
        sisa: totalUtangBaru,
      });
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan transaksi');
    } finally {
      setIsSaving(false);
    }
  };

  const catatLagi = () => {
    setHasil(null);
    reset();
    setTanggal(todayISO());
    loadCustomers();
  };

  const ringkasanLabel = transactionType === 'kasbon' ? 'Kasbon' : 'Pembayaran';

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
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 tracking-tight">Pencatatan Transaksi Kasbon & Pembayaran</h1>
          <p className="text-xs text-slate-500 mt-0.5">Catat transaksi belanja kasbon baru pelanggan atau terima setoran cicilan dengan cepat dan teratur.</p>
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
            onClick={() => { setTransactionType('kasbon'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${transactionType === 'kasbon' ? 'bg-rose-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>📕 + Utang / Kasbon Baru</span>
          </button>
          <button
            type="button"
            onClick={() => { setTransactionType('cicilan'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer ${transactionType === 'cicilan' ? 'bg-[#05603a] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>💵 Terima Bayar / Cicilan</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ================= KOLOM KIRI ================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">

          {/* 1. Pilih Pelanggan */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-slate-800">Pilih Pelanggan Warung <span className="text-rose-500">*</span></label>
              <button type="button" onClick={() => setShowAdd(true)} className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer">
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Pelanggan Baru</span>
              </button>
            </div>

            {selectedPelanggan ? (
              <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-50/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">{initials(selectedPelanggan.nama)}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900 truncate">{selectedPelanggan.nama}</span>
                      <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">{selectedPelanggan.kode}</span>
                    </div>
                    <p className="text-[11px] text-rose-600 font-bold mt-0.5">Total Utang Sekarang: {formatRupiah(utangSebelumnya)}</p>
                  </div>
                </div>
                <button type="button" onClick={() => { setShowDropdown(true); searchRef.current?.focus(); }} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer shrink-0">
                  <span>Ganti Pelanggan</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 text-center">
                Belum ada pelanggan dipilih. Cari nama di bawah{customers.length === 0 ? ' atau tambah pelanggan baru.' : '.'}
              </div>
            )}

            {terkunci && transactionType === 'kasbon' && (
              <div className="mt-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold rounded-xl px-3 py-2 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Kasbon baru dikunci: menunggak {selectedPelanggan?.hari_telat} hari (lewat 7 hari). Terima pembayaran dulu.</span>
              </div>
            )}

            <div className="relative mt-2">
              <span className="absolute left-3.5 top-2.5 text-slate-400"><Search className="w-3.5 h-3.5" /></span>
              <input
                ref={searchRef}
                type="text"
                value={customerSearch}
                onChange={(e) => { setCustomerSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Ketik nama pelanggan lain (misal: Bu Nanik, Mas Budi)..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((c) => (
                        <div
                          key={c.pelanggan_id}
                          onClick={() => { setSelectedId(c.pelanggan_id); setCustomerSearch(''); setShowDropdown(false); setError(''); }}
                          className="p-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-100 flex justify-between items-center"
                        >
                          <span className="text-xs font-bold text-slate-800">{c.nama} <span className="text-[10px] text-slate-400 font-mono ml-1">{c.kode}</span></span>
                          <span className={`text-[11px] font-bold ${c.sisa_utang > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatRupiah(c.sisa_utang)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-slate-500 text-center">Tidak ditemukan. Klik "+ Pelanggan Baru" untuk menambahkan.</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. Nominal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-slate-800">Nominal {transactionType === 'kasbon' ? 'Kasbon Baru' : 'Pembayaran'} <span className="text-rose-500">*</span></label>
              <span className="text-[11px] text-slate-400">Pastikan hitungan warung pas</span>
            </div>

            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 focus-within:bg-white transition">
              <span className="text-xl sm:text-2xl font-black text-slate-900 mr-2">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={nominal ? formatAngkaInput(nominal) : ''}
                onChange={(e) => setNominal(parseAngka(e.target.value))}
                className={`w-full bg-transparent text-xl sm:text-2xl font-black ${transactionType === 'kasbon' ? 'text-rose-600' : 'text-emerald-700'} focus:outline-none tracking-tight`}
              />
              {nominal > 0 && (
                <button type="button" onClick={() => setNominal(0)} className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-slate-400 mr-1 font-medium">Tambah Cepat:</span>
              {[5000, 10000, 20000, 50000, 100000, 200000].map((amt) => (
                <button key={amt} type="button" onClick={() => addNominal(amt)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer">
                  +Rp {amt.toLocaleString('id-ID')}
                </button>
              ))}
              {transactionType === 'cicilan' && utangSebelumnya > 0 && (
                <button type="button" onClick={() => setNominal(utangSebelumnya)} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] px-2.5 py-1 rounded-lg transition cursor-pointer">
                  Lunasi Semua ({formatRupiah(utangSebelumnya)})
                </button>
              )}
            </div>
          </div>

          {/* 3. Tanggal Transaksi */}
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-2">Tanggal Transaksi</label>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <div>
                  <p className="font-bold text-slate-900">
                    {tanggal === todayISO() ? 'Hari ini, ' : ''}{new Date(tanggal + 'T12:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-400">Waktu warung (WIB) • jam dicatat otomatis saat disimpan</p>
                </div>
              </div>
              {showTanggal ? (
                <input
                  type="date"
                  value={tanggal}
                  max={todayISO()}
                  onChange={(e) => { if (e.target.value) setTanggal(e.target.value); }}
                  className="text-[11px] font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white"
                />
              ) : (
                <button type="button" onClick={() => setShowTanggal(true)} className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                  Ubah Tanggal
                </button>
              )}
            </div>
          </div>

          {/* 4. Jatuh Tempo (kasbon) / Metode (cicilan) */}
          {transactionType === 'kasbon' ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-slate-800">Janji Kapan Mau Dibayar? (Jatuh Tempo)</label>
                <span className="text-[11px] text-emerald-700 font-bold">Biar aman ditagih</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {opsiTempo.map((opt) => {
                  const aktif = tempoOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setTempoOption(opt.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        aktif ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs">
                        <opt.icon className={`w-4 h-4 ${aktif ? 'text-white' : 'text-slate-400'}`} />
                        <div>
                          <p className={`font-bold ${aktif ? '' : 'text-slate-800'}`}>{opt.label}</p>
                          <p className={`text-[10px] ${aktif ? 'text-emerald-200' : 'text-slate-400'}`}>{opt.sub}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${aktif ? 'border-white bg-white text-emerald-800' : 'border-slate-300'}`}>
                        {aktif && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {tempoOption === 'kalender' && (
                <input
                  type="date"
                  value={kalenderDate}
                  min={tanggal}
                  onChange={(e) => setKalenderDate(e.target.value)}
                  className="mt-2.5 w-full sm:w-auto text-xs font-bold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              )}
            </div>
          ) : (
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['tunai', 'transfer', 'qris'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetode(m)}
                    className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${metode === m ? 'border-emerald-700 bg-emerald-800 text-white shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}
                  >
                    {m === 'tunai' ? '💵 ' : m === 'transfer' ? '🏦 ' : '📱 '}{labelMetode(m)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= KOLOM KANAN ================= */}
        <div className="lg:col-span-5 space-y-4">

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-800">{transactionType === 'kasbon' ? 'Rincian Barang yang Diambil' : 'Catatan Pembayaran'}</label>
              <span className="text-[11px] text-slate-400">{transactionType === 'kasbon' ? 'Catatan barang' : 'Opsional'}</span>
            </div>
            <textarea
              rows={3}
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder={transactionType === 'kasbon' ? 'Contoh: 2 botol sirup Marjan & 1 renceng Kopi Hitam' : 'Contoh: Titip lewat anaknya'}
              className="w-full bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
            {transactionType === 'kasbon' && (
              <>
                <input
                  type="text"
                  value={catatanKasbon}
                  onChange={(e) => setCatatanKasbon(e.target.value)}
                  placeholder="Catatan tambahan (opsional), misal: diambil anaknya"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-1.5">Barang sering kasbon:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['+ Gas 3kg', '+ Galon Air', '+ Dus Mie Instan', '+ Minyak Goreng 2L', '+ Telur 1kg'].map((item) => (
                      <button key={item} type="button" onClick={() => handlePillClick(item.replace('+ ', ''))} className="bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-800 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-indigo-100 transition cursor-pointer">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Live Preview */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-700">📋</span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Ringkasan Catatan Baru</h3>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${transactionType === 'kasbon' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'}`}>
                {transactionType === 'kasbon' ? 'Kasbon Bertambah' : 'Utang Berkurang'}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">👤</div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{selectedPelanggan?.nama ?? 'Belum dipilih'}</p>
                <p className="text-[10px] text-slate-400 truncate">{selectedPelanggan ? `${selectedPelanggan.kode}${selectedPelanggan.whatsapp ? ' • ' + selectedPelanggan.whatsapp : ''}` : '-'}</p>
              </div>
              {selectedPelanggan && onOpenCustomer && (
                <button type="button" onClick={() => onOpenCustomer(selectedPelanggan.pelanggan_id)} className="ml-auto text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer shrink-0">Lihat Buku</button>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Utang Sebelumnya:</span>
                <span className="font-bold text-slate-800">{formatRupiah(utangSebelumnya)}</span>
              </div>
              <div className="flex justify-between">
                <span>{transactionType === 'kasbon' ? 'Tambahan Kasbon Ini:' : 'Pembayaran Ini:'}</span>
                <span className={`font-bold ${transactionType === 'kasbon' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {transactionType === 'kasbon' ? '+' : '-'}{formatRupiah(nominal)}
                </span>
              </div>
            </div>

            {batasKasbon ? (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Rasio Batas Kasbon (Maks {formatRupiah(batasKasbon)})</span>
                  <span className={rasioBatas >= 100 ? 'text-rose-600' : rasioBatas >= 70 ? 'text-amber-600' : 'text-emerald-600'}>{rasioBatas}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${rasioBatas >= 100 ? 'bg-rose-500' : rasioBatas >= 70 ? 'bg-amber-500' : 'bg-emerald-500'} h-full rounded-full transition-all duration-300`} style={{ width: `${rasioBatas}%` }}></div>
                </div>
              </div>
            ) : (
              <p className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold">Pelanggan ini tanpa batas kasbon.</p>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-900">{transactionType === 'kasbon' ? 'Total Utang Baru:' : 'Sisa Utang Baru:'}</p>
                <p className="text-[10px] text-slate-400">Akan tercatat di buku {selectedPelanggan?.nama ?? 'pelanggan'}</p>
              </div>
              <p className={`text-2xl font-black ${totalUtangBaru === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatRupiah(totalUtangBaru)}</p>
            </div>

            {transactionType === 'kasbon' && (
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500 text-[11px]">Jatuh Tempo Pembayaran:</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <span>🗓️ {formatTanggal(jatuhTempo)}</span>
                </span>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Pencatatan otomatis masuk ke buku {ringkasanLabel.toLowerCase()} <strong>{selectedPelanggan?.nama ?? 'pelanggan'}</strong>. Setelah disimpan, Anda dapat langsung mengirim {transactionType === 'kasbon' ? 'nota tagihan' : 'kwitansi'} via <strong>manual hyperlink wa.me</strong> dari nomor WhatsApp pribadi warung Anda tanpa bot API.
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="lg:col-span-12 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Bottom Form Actions */}
        <div className="lg:col-span-12 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBackToDashboard} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer">
              <span>← Batal / Kembali</span>
            </button>
            <button type="button" onClick={reset} title="Reset Form" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#05603a] hover:bg-[#044e2f] disabled:opacity-60 text-white font-black px-8 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : transactionType === 'kasbon' ? 'Simpan Catatan Kasbon (Enter)' : 'Simpan Pembayaran (Enter)'}</span>
          </button>
        </div>
      </form>

      {/* ================= 3 KARTU STAT DI BAWAH ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-base">📈</div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">Total Kasbon Beredar Hari Ini</p>
            <p className="text-base font-black text-slate-900 mt-0.5">{formatRupiah(stat.beredar)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base">💵</div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">Setoran Masuk Hari Ini</p>
            <p className="text-base font-black text-slate-900 mt-0.5">{formatRupiah(setoranHariIni)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-base">👥</div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">Pelanggan Jatuh Tempo Minggu Ini</p>
            <p className="text-base font-black text-slate-900 mt-0.5">{stat.tempoMinggu} Orang</p>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH PELANGGAN */}
      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onSaved={(p) => {
            setShowAdd(false);
            loadCustomers(p.id);
          }}
        />
      )}

      {/* MODAL BERHASIL + KIRIM WA */}
      {hasil && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Berhasil Dicatat!</h3>
                <p className="text-[11px] text-slate-500">
                  {hasil.jenis === 'kasbon' ? 'Kasbon' : 'Pembayaran'} {formatRupiah(hasil.nominal)} • {hasil.nama} • Sisa {formatRupiah(hasil.sisa)}
                </p>
              </div>
            </div>

            <div className="bg-[#e7f8ee] border border-emerald-100 rounded-2xl p-3.5 text-[11px] text-slate-800 leading-relaxed whitespace-pre-line">{hasil.teks}</div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={buildWaLink(hasil.whatsapp, hasil.teks)}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{hasil.jenis === 'kasbon' ? 'Kirim Nota via WhatsApp' : 'Kirim Kwitansi via WhatsApp'}</span>
              </a>
              <button
                type="button"
                onClick={() => { navigator.clipboard?.writeText(hasil.teks); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{copied ? 'Tersalin! ✓' : 'Salin Teks'}</span>
              </button>
              <button type="button" onClick={catatLagi} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                Catat Lagi
              </button>
              <button type="button" onClick={onBackToDashboard} className="col-span-2 bg-[#05603a] hover:bg-[#044e2f] text-white font-black py-2.5 rounded-xl text-xs cursor-pointer">
                Selesai
              </button>
            </div>
            {!hasil.whatsapp && <p className="text-[10px] text-slate-400 text-center">Pelanggan belum punya nomor WA, kamu bisa memilih kontak sendiri di WhatsApp.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

