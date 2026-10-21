import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar, Download, FileSpreadsheet, ChevronDown, Printer, Search, CheckCircle2,
  AlertCircle, Share2, TrendingUp, Wallet, Clock, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { listSaldo, listTransaksi } from '../lib/api';
import type { SaldoPelanggan, Transaksi } from '../lib/types';
import {
  downloadCsv, escapeHtml, formatRupiah, formatTanggal, formatWaktu, initials, jamWib,
  labelMetode, labelTempo, printHtml, toISODate, todayISO
} from '../lib/format';
import {
  arusHarian, daftarTelat, namaBulan, saldoBerjalan, sum, topBarang, totalPiutang
} from '../lib/analytics';
import { useAuth } from '../context/AuthContext';

const PER_HALAMAN = 10;
const monthKey = (iso: string) => toISODate(new Date(iso)).slice(0, 7);
const rb = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}rb` : String(Math.round(n)));

export default function FinancialReport() {
  const { warung } = useAuth();
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [saldos, setSaldos] = useState<SaldoPelanggan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'semua' | 'pelunasan' | 'kasbon'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [periode, setPeriode] = useState<string>(todayISO().slice(0, 7)); // 'YYYY-MM' atau 'semua'
  const [halaman, setHalaman] = useState(1);
  const [updatedAt, setUpdatedAt] = useState<Date>(new Date());

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [t, s] = await Promise.all([listTransaksi(), listSaldo()]);
      setTransaksis(t);
      setSaldos(s);
      setUpdatedAt(new Date());
    } catch (e: any) {
      console.error(e);
      setError(e?.message || 'Gagal memuat laporan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => setHalaman(1), [activeTab, searchQuery, periode]);

  // ---------------------------------------------------------- Kalkulasi
  const opsiPeriode = useMemo(() => {
    const now = new Date();
    const awal = transaksis.length
      ? new Date(transaksis[transaksis.length - 1].created_at)
      : now;
    const out: { key: string; label: string }[] = [];
    let y = now.getFullYear();
    let m = now.getMonth();
    for (let i = 0; i < 24; i++) {
      out.push({ key: `${y}-${String(m + 1).padStart(2, '0')}`, label: namaBulan(y, m) });
      if (y < awal.getFullYear() || (y === awal.getFullYear() && m <= awal.getMonth())) break;
      m -= 1;
      if (m < 0) { m = 11; y -= 1; }
    }
    return out;
  }, [transaksis]);

  const labelPeriode = periode === 'semua' ? 'Semua Waktu' : namaBulan(Number(periode.slice(0, 4)), Number(periode.slice(5, 7)) - 1);
  const bulanIniKey = todayISO().slice(0, 7);

  const periodeTrans = useMemo(
    () => (periode === 'semua' ? transaksis : transaksis.filter((t) => monthKey(t.created_at) === periode)),
    [transaksis, periode]
  );

  const sebelumnyaTrans = useMemo(() => {
    if (periode === 'semua') return [];
    const y = Number(periode.slice(0, 4));
    const m = Number(periode.slice(5, 7)) - 2;
    const d = new Date(y, m, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    return transaksis.filter((t) => monthKey(t.created_at) === key);
  }, [transaksis, periode]);

  const saldoMap = useMemo(() => saldoBerjalan(transaksis), [transaksis]);

  const piutang = totalPiutang(saldos);
  const aktif = saldos.filter((s) => s.sisa_utang > 0).length;
  const telat = daftarTelat(saldos);
  const piutangTelat = telat.reduce((a, s) => a + s.sisa_utang, 0);
  const lancarNominal = Math.max(piutang - piutangTelat, 0);
  const persenLancar = piutang > 0 ? Math.round((lancarNominal / piutang) * 100) : 100;

  const kasMasuk = sum(periodeTrans, 'cicilan');
  const kasMasukLalu = sum(sebelumnyaTrans, 'cicilan');
  const jumlahBayar = periodeTrans.filter((t) => t.jenis === 'cicilan').length;
  const perubahanKas = kasMasukLalu > 0 ? Math.round(((kasMasuk - kasMasukLalu) / kasMasukLalu) * 100) : null;

  const arus = useMemo(() => arusHarian(transaksis, 7), [transaksis]);
  const maxArus = Math.max(...arus.flatMap((a) => [a.masuk, a.kasbon]), 1);
  const skala = (() => {
    const steps = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000];
    const step = steps.find((s) => s * 3 >= maxArus) ?? steps[steps.length - 1];
    return step * 3;
  })();
  const totalMasuk7 = arus.reduce((a, r) => a + r.masuk, 0);
  const totalKasbon7 = arus.reduce((a, r) => a + r.kasbon, 0);
  const surplus = totalMasuk7 - totalKasbon7;

  const barang = useMemo(() => topBarang(periodeTrans, 4), [periodeTrans]);
  const top2Persen = barang.totalJumlah
    ? Math.round((barang.items.slice(0, 2).reduce((a, b) => a + b.jumlah, 0) / barang.totalJumlah) * 100)
    : 0;

  const totalKasbonSemua = saldos.reduce((a, s) => a + s.total_kasbon, 0);
  const rasioPiutang = totalKasbonSemua > 0 ? Math.round((piutang / totalKasbonSemua) * 100) : 0;
  const skor = rasioPiutang < 35 ? 'SEHAT' : rasioPiutang < 65 ? 'WASPADA' : 'RAWAN';

  const q = searchQuery.trim().toLowerCase();
  const tersaring = periodeTrans.filter((t) => !q || (t.pelanggan?.nama ?? '').toLowerCase().includes(q));
  const hitungTab = {
    semua: tersaring.length,
    pelunasan: tersaring.filter((t) => t.jenis === 'cicilan').length,
    kasbon: tersaring.filter((t) => t.jenis === 'kasbon').length,
  };
  const baris = tersaring.filter((t) => activeTab === 'semua' || (activeTab === 'pelunasan' ? t.jenis === 'cicilan' : t.jenis === 'kasbon'));
  const totalHalaman = Math.max(1, Math.ceil(baris.length / PER_HALAMAN));
  const tampil = baris.slice((halaman - 1) * PER_HALAMAN, halaman * PER_HALAMAN);

  const infoStatus = (t: Transaksi) => {
    const s = saldoMap.get(t.id);
    if (t.jenis === 'kasbon') return { teks: labelTempo(t.tempo_option), warna: 'bg-rose-100 text-rose-700' };
    if (s && s.sesudah <= 0) return { teks: `Lunas ${labelMetode(t.metode_bayar)}`, warna: 'bg-emerald-100 text-emerald-800' };
    const pct = s && s.sebelum > 0 ? Math.round((t.nominal / s.sebelum) * 100) : 0;
    return { teks: `Cicilan ${pct}%`, warna: 'bg-sky-100 text-sky-800' };
  };

  // ---------------------------------------------------------- Aksi
  const exportCsv = () =>
    downloadCsv(`laporan-kasbon-${periode}.csv`, [
      ['Waktu', 'Pelanggan', 'Kode', 'Jenis', 'Rincian/Catatan', 'Status', 'Kasbon Baru', 'Pelunasan Masuk', 'Saldo Berjalan', 'No Kwitansi', 'Metode'],
      ...baris.map((t) => {
        const s = saldoMap.get(t.id);
        return [
          formatWaktu(t.created_at), t.pelanggan?.nama, t.pelanggan?.kode, t.jenis === 'kasbon' ? 'Kasbon Baru' : 'Pelunasan',
          t.barang || t.catatan, infoStatus(t).teks,
          t.jenis === 'kasbon' ? t.nominal : '', t.jenis === 'cicilan' ? t.nominal : '', s?.sesudah ?? '',
          t.no_kwitansi, t.jenis === 'cicilan' ? labelMetode(t.metode_bayar) : '',
        ];
      }),
    ]);

  const cetak = (judul: string) => {
    const rows = baris
      .map((t) => {
        const s = saldoMap.get(t.id);
        return `<tr><td>${escapeHtml(formatWaktu(t.created_at))}</td><td>${escapeHtml(t.pelanggan?.nama)}<br><span class="muted">${escapeHtml(t.barang || t.catatan || '')}</span></td>
        <td>${escapeHtml(infoStatus(t).teks)}</td>
        <td class="r red">${t.jenis === 'kasbon' ? formatRupiah(t.nominal) : '-'}</td>
        <td class="r green">${t.jenis === 'cicilan' ? formatRupiah(t.nominal) : '-'}</td>
        <td class="r">${formatRupiah(Math.max(s?.sesudah ?? 0, 0))}</td></tr>`;
      })
      .join('');
    printHtml(
      judul,
      `<h1>${escapeHtml(warung?.nama_warung || 'Warung')}</h1>
       <p class="muted">${escapeHtml(judul)} • ${escapeHtml(labelPeriode)} • dicetak ${escapeHtml(formatWaktu(new Date().toISOString()))}</p>
       <div class="box">Total piutang<br><b class="red">${formatRupiah(piutang)}</b></div>
       <div class="box">Kas pelunasan masuk<br><b class="green">${formatRupiah(kasMasuk)}</b></div>
       <div class="box">Jatuh tempo / tertahan<br><b class="red">${formatRupiah(piutangTelat)}</b></div>
       <table><thead><tr><th>Waktu</th><th>Pelanggan & rincian</th><th>Status</th><th class="r">Kasbon baru</th><th class="r">Pelunasan</th><th class="r">Saldo</th></tr></thead><tbody>${rows}</tbody></table>`
    );
  };

  const bagikan = () => {
    const teks =
      `Rekap ${warung?.nama_warung || 'Warung'} - ${labelPeriode}\n` +
      `Total piutang: ${formatRupiah(piutang)} (${aktif} pelanggan)\n` +
      `Kas pelunasan masuk: ${formatRupiah(kasMasuk)} (${jumlahBayar}x)\n` +
      `Jatuh tempo/tertahan: ${formatRupiah(piutangTelat)} (${telat.length} warga)\n` +
      `Skor kasbon: ${skor}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(teks)}`, '_blank');
  };

  const menitLalu = Math.max(0, Math.round((Date.now() - updatedAt.getTime()) / 60000));

  return (
    <div className="space-y-6">

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-2 border-b border-slate-200/60 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-200/80 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>REKAPITULASI USAHA • Diperbarui {menitLalu === 0 ? 'baru saja' : `${menitLalu} menit lalu`}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Laporan Keuangan & Piutang Warung</h1>
          <p className="text-xs text-slate-500 mt-0.5">Rekapitulasi kasbon tertagih, mutasi perputaran modal dagang, dan analisa kelancaran bayar warga tetangga.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{periode === bulanIniKey ? `Bulan Ini – ${labelPeriode}` : labelPeriode}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Pilih periode"
            >
              {opsiPeriode.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
              <option value="semua">Semua Waktu</option>
            </select>
          </div>

          <button onClick={() => cetak('Laporan Keuangan')} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Unduh PDF</span>
          </button>

          <button onClick={exportCsv} className="bg-[#05603a] hover:bg-[#044e2f] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition cursor-pointer">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Ekspor Excel / CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-4 py-3 flex justify-between gap-3">
          <span>{error}</span><button onClick={load} className="font-bold underline cursor-pointer">Coba lagi</button>
        </div>
      )}

      {/* ================= 4 KARTU METRIK ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">TOTAL KASBON BEREDAR</p>
              <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(piutang)}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Wallet className="w-4 h-4" /></div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
            <span className="bg-slate-100 text-slate-700 font-extrabold text-[10px] px-2 py-0.5 rounded">{saldos.length} Pelanggan</span>
            <span className="text-[11px] text-slate-400">{aktif} orang aktif ada kasbon</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">KAS PELUNASAN MASUK</p>
              <p className="text-2xl font-black text-emerald-600 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(kasMasuk)}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
            {perubahanKas !== null && (
              <span className={`${perubahanKas >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'} font-extrabold text-[10px] px-2 py-0.5 rounded border`}>
                {perubahanKas >= 0 ? '↗ +' : '↘ '}{perubahanKas}%
              </span>
            )}
            <span className="text-[11px] text-slate-400">{jumlahBayar} kali cicil/lunas</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">JATUH TEMPO / TERTAHAN</p>
              <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(piutangTelat)}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Clock className="w-4 h-4" /></div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
            {telat.length > 0 && <span className="bg-rose-50 text-rose-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-rose-200">Perlu Disapa</span>}
            <span className="text-[11px] text-slate-400">{telat.length} warga nunggak</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">MODAL TERSELAMATKAN</p>
              <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoading ? '...' : formatRupiah(lancarNominal)}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mr-2">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${persenLancar}%` }}></div>
              </div>
              <span className="text-emerald-700 whitespace-nowrap">{persenLancar}% Lancar</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GRAFIK & KOMPOSISI BARANG ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Arus Mutasi Kasbon 7 Hari Terakhir</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Perbandingan uang belanjaan kasbon keluar vs uang bayar cicilan masuk</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#064e3b]"></span> Kas Masuk</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-600"></span> Kasbon Baru</span>
            </div>
          </div>

          <div className="pt-4 pb-2">
            <div className="relative h-44 flex items-end justify-between gap-2 px-2 text-[10px] font-bold text-slate-400">
              <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none text-[9px] text-slate-300">
                <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>{rb(skala)}</span></div>
                <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>{rb((skala * 2) / 3)}</span></div>
                <div className="border-b border-dashed border-slate-100 w-full flex justify-between"><span>{rb(skala / 3)}</span></div>
                <div className="border-b border-slate-200 w-full flex justify-between"><span>0</span></div>
              </div>

              {arus.map((a) => (
                <div key={a.key} className="flex-1 flex flex-col items-center gap-1 z-10">
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    <div title={`Kas masuk ${formatRupiah(a.masuk)}`} className="w-3 sm:w-4 bg-[#064e3b] rounded-t-sm" style={{ height: `${a.masuk > 0 ? Math.max((a.masuk / skala) * 100, 2) : 0}%` }}></div>
                    <div title={`Kasbon baru ${formatRupiah(a.kasbon)}`} className="w-3 sm:w-4 bg-rose-600 rounded-t-sm" style={{ height: `${a.kasbon > 0 ? Math.max((a.kasbon / skala) * 100, 2) : 0}%` }}></div>
                  </div>
                  <span className={a.isToday ? 'text-emerald-700 font-extrabold' : ''}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`${surplus >= 0 ? 'bg-emerald-50/70 border-emerald-100' : 'bg-rose-50/70 border-rose-100'} border rounded-xl p-3 flex items-center justify-between text-xs gap-2`}>
            <div className="flex items-center gap-2 text-slate-700">
              {surplus >= 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              <span>
                {surplus >= 0 ? 'Surplus Kas Pelunasan' : 'Kasbon Baru Melebihi Pelunasan'}:{' '}
                <strong className={`${surplus >= 0 ? 'text-emerald-800' : 'text-rose-700'} font-black`}>{surplus >= 0 ? '+' : '-'}{formatRupiah(Math.abs(surplus))}</strong>{' '}
                {surplus >= 0 ? 'lebih banyak daripada kasbon baru 7 hari ini.' : 'dibanding uang masuk 7 hari ini.'}
              </span>
            </div>
            <span className={`bg-white ${surplus >= 0 ? 'text-emerald-800 border-emerald-200' : 'text-rose-700 border-rose-200'} border text-[10px] font-black px-2 py-0.5 rounded-md uppercase whitespace-nowrap`}>
              {surplus >= 0 ? 'ARUS SEHAT' : 'WASPADA'}
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Barang Kasbon Terbanyak</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Komposisi barang yang paling sering ditangguhkan pembayarannya ({labelPeriode}).</p>
            </div>
            <span className="text-slate-400 text-lg">📦</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {barang.items.length === 0 && <p className="text-center text-slate-400 py-4">Belum ada rincian barang pada periode ini.</p>}
            {barang.items.map((b, i) => {
              const pct = barang.totalJumlah ? Math.round((b.jumlah / barang.totalJumlah) * 100) : 0;
              const warna = i < 3 ? 'bg-emerald-600' : 'bg-slate-400';
              return (
                <div key={b.nama}>
                  <div className="flex justify-between font-bold text-slate-700 mb-1 gap-2">
                    <span className="flex items-center gap-2 min-w-0"><span className={`w-2 h-2 rounded-full shrink-0 ${warna}`}></span><span className="truncate">{b.nama}</span></span>
                    <span className="shrink-0">{formatRupiah(b.nominal)} <strong className="text-slate-900 ml-1">{pct}%</strong></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${warna} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {barang.items.length >= 2 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
              <span className="text-emerald-700">💡</span>
              <span><strong>Perhatian Juragan:</strong> {barang.items[0].nama} dan {barang.items[1].nama} menyumbang {top2Persen}% kasbon. Pastikan pembeli melunasi sebelum mengambil barang yang sama berikutnya.</span>
            </div>
          )}
        </div>
      </div>

      {/* ================= TABEL REKAPITULASI ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600 overflow-x-auto">
            {([['semua', 'Semua Rekap Harian'], ['pelunasan', 'Pelunasan Masuk'], ['kasbon', 'Kasbon Baru']] as const).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${activeTab === id ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
              >
                {label} ({hitungTab[id]})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400"><Search className="w-3.5 h-3.5" /></span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Saring nama pelanggan..."
                className="bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
            <button onClick={() => cetak('Rekap Transaksi')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

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
              {tampil.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">{isLoading ? 'Memuat data...' : 'Belum ada data transaksi pada periode ini.'}</td></tr>
              )}
              {tampil.map((t) => {
                const isK = t.jenis === 'kasbon';
                const s = saldoMap.get(t.id);
                const st = infoStatus(t);
                const sisa = Math.max(s?.sesudah ?? 0, 0);
                return (
                  <tr key={t.id}>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-800">{formatTanggal(t.created_at)}</p>
                      <p className="text-[10px] text-slate-400">{jamWib(t.created_at)}</p>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${isK ? 'bg-rose-100 text-rose-700' : 'bg-emerald-800 text-white'}`}>{initials(t.pelanggan?.nama ?? '?')}</div>
                        <div>
                          <p className="font-bold text-slate-900">{t.pelanggan?.nama ?? 'Warga'}</p>
                          <p className="text-[10px] text-slate-400 max-w-[220px] truncate">{t.barang || t.catatan || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className={`${isK ? 'text-rose-600' : 'text-emerald-700'} font-bold flex items-center gap-1 whitespace-nowrap`}>
                        <span className={`w-2 h-2 rounded-full border-2 ${isK ? 'border-rose-600' : 'border-emerald-600'}`}></span> {isK ? 'Kasbon Baru' : 'Kas Masuk'}
                      </span>
                    </td>
                    <td className="py-3.5"><span className={`${st.warna} text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>{st.teks}</span></td>
                    <td className={`py-3.5 text-right ${isK ? 'font-black text-rose-600' : 'text-slate-300'}`}>{isK ? `-${formatRupiah(t.nominal)}` : '-'}</td>
                    <td className={`py-3.5 text-right ${!isK ? 'font-black text-emerald-600' : 'text-slate-300'}`}>{!isK ? `+${formatRupiah(t.nominal)}` : '-'}</td>
                    <td className={`py-3.5 text-right font-bold ${sisa > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{!isK && sisa > 0 ? `Sisa ${formatRupiah(sisa)}` : formatRupiah(sisa)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <span>
            Menampilkan {baris.length === 0 ? 0 : (halaman - 1) * PER_HALAMAN + 1}–{Math.min(halaman * PER_HALAMAN, baris.length)} dari {baris.length} mutasi kasbon {periode === 'semua' ? 'seluruh waktu' : labelPeriode}
          </span>
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <button disabled={halaman <= 1} onClick={() => setHalaman((h) => h - 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalHalaman }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalHalaman || Math.abs(n - halaman) <= 1)
              .map((n, i, arr) => (
                <React.Fragment key={n}>
                  {i > 0 && n - arr[i - 1] > 1 && <span className="px-1">…</span>}
                  <button onClick={() => setHalaman(n)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${n === halaman ? 'bg-[#05603a] text-white shadow-sm' : 'border border-slate-200 hover:bg-slate-50'}`}>{n}</button>
                </React.Fragment>
              ))}
            <button disabled={halaman >= totalHalaman} onClick={() => setHalaman((h) => h + 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= BANNER TIPS ================= */}
      <div className="bg-gradient-to-r from-[#064e3b] to-[#043d2e] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 text-xl shrink-0">🛡️</div>
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-[11px] font-bold mb-1">
              <span>TIPS KEUANGAN JURAGAN {(warung?.nama_pemilik || '').toUpperCase()}</span>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">Skor Kasbon: {skor}</span>
            </div>
            <h4 className="text-base sm:text-lg font-black tracking-tight">
              Piutang Warung Anda Berada di {rasioPiutang}% dari Seluruh Kasbon yang Pernah Dicatat
            </h4>
            <p className="text-xs text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
              {skor === 'SEHAT'
                ? 'Perputaran modal Anda baik. Pertahankan dengan menagih tepat waktu dan menahan kasbon baru bagi warga yang belum melunasi.'
                : skor === 'WASPADA'
                ? 'Sebagian besar kasbon belum kembali. Kirim pengingat WhatsApp ke warga yang mendekati jatuh tempo.'
                : 'Piutang menumpuk. Tahan kasbon baru untuk warga yang menunggak dan fokus menagih dulu.'}
            </p>
          </div>
        </div>

        <button onClick={bagikan} className="bg-white hover:bg-slate-50 text-emerald-900 font-black text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap transition cursor-pointer shrink-0">
          <Share2 className="w-4 h-4 text-emerald-700" />
          <span>Bagikan Rekap ke Pembukuan</span>
        </button>
      </div>
    </div>
  );
}
