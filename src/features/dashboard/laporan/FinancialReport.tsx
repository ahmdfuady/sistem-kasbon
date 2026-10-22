import React, { useEffect, useMemo, useState } from 'react';
import { listSaldo, listTransaksi } from '../../../api';
import type { SaldoPelanggan, Transaksi } from '../../../lib/types';
import {
  downloadCsv, escapeHtml, formatRupiah, formatWaktu, labelMetode, printHtml, todayISO
} from '../../../lib/utils';
import {
  arusHarian, daftarTelat, namaBulan, saldoBerjalan, sum, topBarang, totalPiutang
} from '../../../lib/analytics';
import { useAuth } from '../../auth/AuthContext';
import { PER_HALAMAN, infoStatus, monthKey } from './helpers';
import HeaderLaporan from './HeaderLaporan';
import KartuMetrikLaporan from './KartuMetrikLaporan';
import GrafikArus from './GrafikArus';
import BarangTerbanyak from './BarangTerbanyak';
import TabelRekap, { type TabLaporan } from './TabelRekap';
import BannerTips from './BannerTips';

/** Halaman Laporan Keuangan: ringkasan, grafik 7 hari, barang terbanyak, dan tabel rekap */
export default function FinancialReport() {
  const { warung } = useAuth();
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [saldos, setSaldos] = useState<SaldoPelanggan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<TabLaporan>('semua');
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

  // ---------------------------------------------------------- Aksi
  const exportCsv = () =>
    downloadCsv(`laporan-kasbon-${periode}.csv`, [
      ['Waktu', 'Pelanggan', 'Kode', 'Jenis', 'Rincian/Catatan', 'Status', 'Kasbon Baru', 'Pelunasan Masuk', 'Saldo Berjalan', 'No Kwitansi', 'Metode'],
      ...baris.map((t) => {
        const s = saldoMap.get(t.id);
        return [
          formatWaktu(t.created_at), t.pelanggan?.nama, t.pelanggan?.kode, t.jenis === 'kasbon' ? 'Kasbon Baru' : 'Pelunasan',
          t.barang || t.catatan, infoStatus(t, saldoMap).teks,
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
        <td>${escapeHtml(infoStatus(t, saldoMap).teks)}</td>
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
      <HeaderLaporan
        menitLalu={menitLalu}
        periode={periode}
        bulanIniKey={bulanIniKey}
        labelPeriode={labelPeriode}
        opsiPeriode={opsiPeriode}
        onPeriodeChange={setPeriode}
        onCetak={() => cetak('Laporan Keuangan')}
        onExportCsv={exportCsv}
      />

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-4 py-3 flex justify-between gap-3">
          <span>{error}</span><button onClick={load} className="font-bold underline cursor-pointer">Coba lagi</button>
        </div>
      )}

      <KartuMetrikLaporan
        isLoading={isLoading}
        piutang={piutang}
        jumlahPelanggan={saldos.length}
        aktif={aktif}
        kasMasuk={kasMasuk}
        perubahanKas={perubahanKas}
        jumlahBayar={jumlahBayar}
        piutangTelat={piutangTelat}
        jumlahTelat={telat.length}
        lancarNominal={lancarNominal}
        persenLancar={persenLancar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <GrafikArus arus={arus} skala={skala} surplus={surplus} />
        <BarangTerbanyak barang={barang} labelPeriode={labelPeriode} top2Persen={top2Persen} />
      </div>

      <TabelRekap
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hitungTab={hitungTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCetak={() => cetak('Rekap Transaksi')}
        tampil={tampil}
        totalBaris={baris.length}
        saldoMap={saldoMap}
        isLoading={isLoading}
        periode={periode}
        labelPeriode={labelPeriode}
        halaman={halaman}
        totalHalaman={totalHalaman}
        onHalamanChange={setHalaman}
      />

      <BannerTips namaPemilik={warung?.nama_pemilik} skor={skor} rasioPiutang={rasioPiutang} onBagikan={bagikan} />
    </div>
  );
}
