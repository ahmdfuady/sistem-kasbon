import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Phone, MapPin, Calendar, PlusCircle, CheckCircle2, ExternalLink, Printer,
  MoreHorizontal, ArrowUpRight, ArrowDownLeft, Download, Copy, Edit2, Lock, TrendingUp,
  Check, Trash2, Save, X
} from 'lucide-react';
import { deletePelanggan, deleteTransaksi, getPelanggan, getSaldo, listTransaksi, updatePelanggan } from '../lib/api';
import type { Pelanggan, SaldoPelanggan, Transaksi } from '../lib/types';
import {
  buildPesanTagihan, buildWaLink, escapeHtml, formatRupiah, formatTanggal, formatWaktu,
  formatWaktuRelatif, initials, jamWib, labelMetode, pecahBarang, printHtml
} from '../lib/format';
import { saldoBerjalan } from '../lib/analytics';
import { useAuth } from '../context/AuthContext';
import AddCustomerModal from '../components/AddCustomerModal';

interface CustomerDetailProps {
  pelangganId: string;
  onBackToDashboard: () => void;
  onRecordTransaction?: (pelangganId: string, jenis: 'kasbon' | 'cicilan') => void;
}

export default function CustomerDetail({ pelangganId, onBackToDashboard, onRecordTransaction }: CustomerDetailProps) {
  const { warung } = useAuth();
  const [saldo, setSaldo] = useState<SaldoPelanggan | null>(null);
  const [pelanggan, setPelanggan] = useState<Pelanggan | null>(null);
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterTab, setFilterTab] = useState<'semua' | 'kasbon' | 'cicilan'>('semua');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editCatatan, setEditCatatan] = useState(false);
  const [catatanDraft, setCatatanDraft] = useState('');
  const [savingCatatan, setSavingCatatan] = useState(false);

  const load = async () => {
    setError('');
    try {
      const [s, p, t] = await Promise.all([getSaldo(pelangganId), getPelanggan(pelangganId), listTransaksi({ pelangganId })]);
      setSaldo(s);
      setPelanggan(p);
      setTransaksiList(t);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal memuat data pelanggan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pelangganId]);

  // ---------------------------------------------------------- Kalkulasi
  const saldoMap = useMemo(() => saldoBerjalan(transaksiList), [transaksiList]);

  // Alokasi pembayaran ke kasbon secara urut (FIFO) untuk status tiap kasbon
  const statusKasbon = useMemo(() => {
    const asc = [...transaksiList].sort((a, b) => a.created_at.localeCompare(b.created_at));
    let pool = asc.filter((t) => t.jenis === 'cicilan').reduce((a, t) => a + t.nominal, 0);
    const out = new Map<string, { terbayar: number; sisa: number }>();
    for (const t of asc) {
      if (t.jenis !== 'kasbon') continue;
      const bayar = Math.min(t.nominal, Math.max(pool, 0));
      pool -= bayar;
      out.set(t.id, { terbayar: bayar, sisa: t.nominal - bayar });
    }
    return out;
  }, [transaksiList]);

  const barangFavorit = useMemo(() => {
    const map = new Map<string, { nama: string; jumlah: number; nominal: number }>();
    for (const t of transaksiList) {
      if (t.jenis !== 'kasbon') continue;
      const items = pecahBarang(t.barang);
      for (const raw of items) {
        const key = raw.toLowerCase().replace(/\s+/g, ' ');
        const cur = map.get(key) ?? { nama: raw.charAt(0).toUpperCase() + raw.slice(1), jumlah: 0, nominal: 0 };
        cur.jumlah += 1;
        cur.nominal += t.nominal / items.length;
        map.set(key, cur);
      }
    }
    return [...map.values()].sort((a, b) => b.jumlah - a.jumlah).slice(0, 3);
  }, [transaksiList]);

  const pola = useMemo(() => {
    const asc = [...transaksiList].sort((a, b) => a.created_at.localeCompare(b.created_at));
    const bayar = asc.filter((t) => t.jenis === 'cicilan');
    let teks = 'Belum cukup data pembayaran untuk membaca pola.';
    if (bayar.length >= 2) {
      let total = 0;
      for (let i = 1; i < bayar.length; i++) {
        total += (new Date(bayar[i].created_at).getTime() - new Date(bayar[i - 1].created_at).getTime()) / 86400000;
      }
      teks = `Rata-rata membayar setiap ${Math.max(1, Math.round(total / (bayar.length - 1)))} hari sekali`;
    } else if (bayar.length === 1) {
      teks = 'Baru membayar 1 kali, pola belum terbaca.';
    }
    const pts = asc.map((t) => saldoMap.get(t.id)?.sesudah ?? 0).slice(-12);
    let path = 'M0 15 L100 15';
    let last = { x: 100, y: 15 };
    if (pts.length >= 2) {
      const max = Math.max(...pts, 1);
      const min = Math.min(...pts, 0);
      const range = max - min || 1;
      const coords = pts.map((v, i) => ({ x: (i / (pts.length - 1)) * 96 + 2, y: 26 - ((v - min) / range) * 22 }));
      path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
      last = coords[coords.length - 1];
    }
    return { teks, path, last };
  }, [transaksiList, saldoMap]);

  const tampil = transaksiList.filter((t) => filterTab === 'semua' || t.jenis === filterTab);
  const terakhirUpdate = transaksiList[0]?.created_at;

  // ---------------------------------------------------------- Aksi
  const handleCopyLink = (link: string) => {
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveCatatan = async () => {
    if (!pelanggan) return;
    setSavingCatatan(true);
    try {
      const upd = await updatePelanggan(pelanggan.id, { catatan_pribadi: catatanDraft.trim() || null });
      setPelanggan(upd);
      setEditCatatan(false);
    } catch (err: any) {
      alert(err?.message || 'Gagal menyimpan catatan');
    } finally {
      setSavingCatatan(false);
    }
  };

  const handleDeleteTransaksi = async (t: Transaksi) => {
    if (!confirm(`Hapus catatan ${t.jenis === 'kasbon' ? 'kasbon' : 'pembayaran'} sebesar ${formatRupiah(t.nominal)}? Saldo akan dihitung ulang.`)) return;
    try {
      await deleteTransaksi(t.id);
      await load();
    } catch (err: any) {
      alert(err?.message || 'Gagal menghapus transaksi');
    }
  };

  const handleDeletePelanggan = async () => {
    if (!pelanggan) return;
    if (!confirm(`Hapus pelanggan "${pelanggan.nama}" beserta SELURUH riwayat kasbonnya? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deletePelanggan(pelanggan.id);
      onBackToDashboard();
    } catch (err: any) {
      alert(err?.message || 'Gagal menghapus pelanggan');
    }
  };

  const handleCetak = () => {
    if (!saldo || !pelanggan) return;
    const asc = [...transaksiList].sort((a, b) => a.created_at.localeCompare(b.created_at));
    const rows = asc
      .map((t) => {
        const s = saldoMap.get(t.id);
        return `<tr><td>${escapeHtml(formatWaktu(t.created_at))}</td><td>${t.jenis === 'kasbon' ? 'Kasbon' : 'Bayar'}</td>
        <td>${escapeHtml(t.barang || t.catatan || '-')}${t.no_kwitansi ? `<br><span class="muted">${escapeHtml(t.no_kwitansi)}</span>` : ''}</td>
        <td class="r ${t.jenis === 'kasbon' ? 'red' : 'green'}">${t.jenis === 'kasbon' ? '+' : '-'}${formatRupiah(t.nominal)}</td>
        <td class="r">${formatRupiah(s?.sesudah ?? 0)}</td></tr>`;
      })
      .join('');
    printHtml(
      `Rincian Kasbon ${pelanggan.nama}`,
      `<h1>${escapeHtml(warung?.nama_warung || 'Warung')}</h1>
       <p class="muted">${escapeHtml(warung?.alamat || '')}</p>
       <h2>Rincian Kasbon - ${escapeHtml(pelanggan.nama)} (${escapeHtml(pelanggan.kode)})</h2>
       <div class="box">Total kasbon<br><b>${formatRupiah(saldo.total_kasbon)}</b></div>
       <div class="box">Sudah dibayar<br><b class="green">${formatRupiah(saldo.total_bayar)}</b></div>
       <div class="box">Sisa utang<br><b class="red">${formatRupiah(saldo.sisa_utang)}</b></div>
       <table><thead><tr><th>Waktu</th><th>Jenis</th><th>Rincian</th><th class="r">Nominal</th><th class="r">Sisa</th></tr></thead><tbody>${rows}</tbody></table>
       <p class="muted" style="margin-top:16px">Dicetak ${escapeHtml(formatWaktu(new Date().toISOString()))}${warung?.catatan_struk ? ' • ' + escapeHtml(warung.catatan_struk) : ''}</p>`
    );
  };

  // ---------------------------------------------------------- Render
  if (isLoading) {
    return <div className="p-8 text-center text-slate-400 text-sm">Memuat data pelanggan...</div>;
  }

  if (!saldo || !pelanggan) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500 text-sm">{error || 'Data pelanggan tidak ditemukan.'}</p>
        <button onClick={onBackToDashboard} className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">Kembali</button>
      </div>
    );
  }

  const waMessage = warung
    ? buildPesanTagihan({
        template: warung.template_wa,
        namaWarga: saldo.nama,
        namaWarung: warung.nama_warung,
        namaPemilik: warung.nama_pemilik,
        nominal: saldo.sisa_utang,
        jatuhTempo: saldo.jatuh_tempo_terakhir,
        catatanStruk: warung.catatan_struk,
      })
    : '';
  const waLink = buildWaLink(saldo.whatsapp, waMessage);
  const waLinkText = waLink.replace('https://', '');
  const persenBayar = saldo.total_kasbon > 0 ? Math.round((saldo.total_bayar / saldo.total_kasbon) * 100) : 0;
  const telat = saldo.sisa_utang > 0 && saldo.hari_telat > 0;
  const terkunci = !!warung?.kunci_kasbon && saldo.hari_telat > 7 && saldo.sisa_utang > 0;
  const sejak = new Date(pelanggan.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  const namaPemilik = warung?.nama_pemilik || 'pemilik warung';

  return (
    <div className="space-y-6">

      {/* Breadcrumb Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center flex-wrap gap-2 text-slate-500">
          <button onClick={onBackToDashboard} className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Pelanggan</span>
          </button>
          <span>•</span>
          <span>Buku Pelanggan</span>
          <span>›</span>
          <span className="font-bold text-slate-800">{pelanggan.nama}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className={`w-2 h-2 rounded-full ${telat ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
          <span>{terakhirUpdate ? `Transaksi terakhir ${formatWaktuRelatif(terakhirUpdate)} • ${jamWib(terakhirUpdate)}` : 'Belum ada transaksi'}</span>
        </div>
      </div>

      {/* ================= PROFILE CARD HEADER ================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* Info Pelanggan */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-800 font-black text-xl flex items-center justify-center shrink-0">
                {initials(pelanggan.nama)}
              </div>
              {saldo.sisa_utang <= 0 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{pelanggan.nama}</h2>
                <span className="bg-slate-100 text-slate-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">ID: #{pelanggan.kode}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{pelanggan.whatsapp || 'Belum ada nomor WA'}</span>
                </span>
                {pelanggan.alamat && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{pelanggan.alamat}</span></span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>Pelanggan sejak {sejak}</span></span>
              </div>
            </div>
          </div>

          {/* Sisa Kasbon & Progress */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
            <div className={`${telat ? 'bg-rose-50/70 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'} border rounded-2xl p-4 min-w-[200px]`}>
              <div className="flex items-center justify-between mb-1 gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">TOTAL SISA KASBON</span>
                {telat && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><span>🚨 Telat {saldo.hari_telat} Hari</span></span>
                )}
                {!telat && saldo.sisa_utang <= 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">✓ Lunas</span>
                )}
              </div>
              <p className={`text-2xl font-black ${saldo.sisa_utang > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatRupiah(saldo.sisa_utang)}</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span>⏱️ Jatuh tempo: {saldo.sisa_utang > 0 ? formatTanggal(saldo.jatuh_tempo_terakhir) : '-'}</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[200px]">
              <p className="text-[10px] font-bold text-slate-400">Total Seluruh Riwayat Kasbon</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{formatRupiah(saldo.total_kasbon)}</p>
              <div className="mt-2 space-y-1">
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(persenBayar, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-500">
                  <span className="text-emerald-700 font-bold">Sudah Terbayar</span> {formatRupiah(saldo.total_bayar)} ({persenBayar}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => !terkunci && onRecordTransaction?.(saldo.pelanggan_id, 'kasbon')}
            disabled={terkunci}
            title={terkunci ? 'Dikunci: menunggak lebih dari 7 hari' : ''}
            className="bg-rose-700 hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            {terkunci ? <Lock className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            <span>{terkunci ? 'Kasbon Terkunci (Nunggak)' : '+ Catat Kasbon Baru'}</span>
          </button>

          <button onClick={() => onRecordTransaction?.(saldo.pelanggan_id, 'cicilan')} className="bg-[#05603a] hover:bg-[#044e2f] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
            <span>+ Terima Cicilan / Bayar</span>
          </button>

          <button onClick={() => window.open(waLink, '_blank')} className="bg-[#25d366] hover:bg-[#20ba59] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
            <ExternalLink className="w-4 h-4" />
            <span>Buka wa.me {pelanggan.nama}</span>
          </button>

          <button onClick={handleCetak} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer">
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Cetak Rincian Kasbon</span>
          </button>

          <div className="relative">
            <button onClick={() => setShowMenu((v) => !v)} className="w-9 h-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center transition cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute z-20 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg text-xs overflow-hidden">
                  <button onClick={() => { setShowMenu(false); setShowEdit(true); }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" /> Ubah Data Pelanggan
                  </button>
                  <button onClick={() => { setShowMenu(false); handleDeletePelanggan(); }} className="w-full text-left px-3 py-2.5 hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2 border-t border-slate-100 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Hapus Pelanggan
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= MAIN 2 KOLOM ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* KOLOM KIRI (RIWAYAT TRANSAKSI) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Riwayat Transaksi Lengkap</h3>
                  <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded-full">{transaksiList.length} Catatan</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Buku catatan rincian hutang dan cicilan {pelanggan.nama}</p>
              </div>

              <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold text-slate-600">
                {([['semua', 'Semua'], ['kasbon', 'Kasbon Baru'], ['cicilan', 'Cicilan / Bayar']] as const).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setFilterTab(id)}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterTab === id ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {tampil.length === 0 && (
                <p className="py-8 text-center text-xs text-slate-400">Belum ada riwayat transaksi untuk pelanggan ini.</p>
              )}

              {tampil.map((t, idx) => {
                const isKasbon = t.jenis === 'kasbon';
                const st = statusKasbon.get(t.id);
                const sisaSetelah = saldoMap.get(t.id)?.sesudah ?? 0;
                const lewatTempo = isKasbon && st && st.sisa > 0 && !!t.jatuh_tempo && t.jatuh_tempo < new Date().toLocaleDateString('en-CA');
                return (
                  <div
                    key={t.id}
                    className={`group p-4 rounded-xl border bg-white transition flex items-start justify-between gap-4 ${
                      idx === 0 ? (isKasbon ? 'border-rose-100 hover:border-rose-200' : 'border-emerald-100 hover:border-emerald-200') : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isKasbon ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {isKasbon ? <ArrowUpRight className="w-4 h-4 stroke-[2.5]" /> : <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-x-2">
                          <span className="font-extrabold text-xs text-slate-900">{isKasbon ? 'Kasbon Baru' : 'Cicilan Masuk'}</span>
                          <span className="text-[11px] text-slate-400">• {formatWaktu(t.created_at)}</span>
                        </div>

                        {isKasbon && st && (
                          st.sisa <= 0 ? (
                            <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">✓ Lunas</span>
                          ) : st.terbayar > 0 ? (
                            <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">Sebagian Lunas (Tersisa {formatRupiah(st.sisa)})</span>
                          ) : (
                            <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-100">
                              ⏱️ Belum Lunas{t.jatuh_tempo ? ` (Tempo ${formatTanggal(t.jatuh_tempo)})` : ''}{lewatTempo ? ' • Lewat' : ''}
                            </span>
                          )
                        )}
                        {!isKasbon && (
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                            ✓ Diterima ({labelMetode(t.metode_bayar)})
                          </span>
                        )}

                        <p className="text-xs font-bold text-slate-800 break-words">{(isKasbon ? t.barang : t.catatan) || (isKasbon ? 'Tanpa rincian barang' : 'Pembayaran kasbon')}</p>
                        {isKasbon && t.catatan && <p className="text-[11px] text-slate-400 italic">↳ Catatan: {t.catatan}</p>}
                        {!isKasbon && t.no_kwitansi && (
                          <p className="text-[11px] text-slate-400 font-mono">🧾 Kwitansi No: #{t.no_kwitansi} • {labelMetode(t.metode_bayar)} {formatRupiah(t.nominal)}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-sm font-black ${isKasbon ? 'text-rose-600' : 'text-emerald-600'}`}>{isKasbon ? '+' : '-'}{formatRupiah(t.nominal)}</p>
                      <p className="text-[10px] text-slate-400">Sisa: {formatRupiah(Math.max(sisaSetelah, 0))}</p>
                      <button onClick={() => handleDeleteTransaksi(t)} title="Hapus catatan ini" className="mt-1 text-slate-300 hover:text-rose-600 opacity-60 group-hover:opacity-100 transition cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Menampilkan {tampil.length} dari total {transaksiList.length} transaksi</span>
              <button onClick={handleCetak} className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Salinan PDF</span>
              </button>
            </div>
          </div>

          {/* Pola Kasbon Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold"><TrendingUp className="w-5 h-5" /></div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Pola Kasbon {pelanggan.nama}</h4>
                <p className="text-[11px] text-slate-400">{pola.teks}</p>
              </div>
            </div>
            <svg className="w-24 h-8 text-emerald-600 shrink-0" viewBox="0 0 100 30" fill="none">
              <path d={pola.path} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={pola.last.x} cy={pola.last.y} r="3" fill="#dc2626" />
            </svg>
          </div>
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-4 space-y-4">

          {/* 1. Box Pengingat WhatsApp */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 text-lg">💬</span>
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Pengingat WhatsApp</h3>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">Gratis Tanpa Bot API</span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Klik tombol di bawah untuk langsung membuka chat WhatsApp pribadi Anda ke nomor {pelanggan.nama} ({pelanggan.whatsapp || 'nomor belum diisi'}) dengan draf pesan kasbon yang sudah terangkai rapi via tautan wa.me.
            </p>

            <div className="bg-[#e7f8ee] border border-emerald-100/90 rounded-2xl p-3.5 relative text-xs text-slate-800 leading-relaxed">
              <p className="text-[11px] whitespace-pre-line">{waMessage}</p>
              <div className="text-right text-[10px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')}</span>
                <span className="text-emerald-600 font-bold">✓✓</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span className="truncate max-w-[200px]">{waLinkText}</span>
              <button onClick={() => handleCopyLink(waLink)} className="text-emerald-700 font-bold hover:underline shrink-0 ml-2 flex items-center gap-1 cursor-pointer">
                <Copy className="w-3 h-3" />
                <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>
            </div>

            <button onClick={() => window.open(waLink, '_blank')} className="w-full bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer">
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
              {!editCatatan ? (
                <button onClick={() => { setCatatanDraft(pelanggan.catatan_pribadi ?? ''); setEditCatatan(true); }} className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer">
                  <Edit2 className="w-3 h-3" /><span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[11px] font-bold">
                  <button onClick={() => setEditCatatan(false)} className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer"><X className="w-3 h-3" />Batal</button>
                  <button onClick={handleSaveCatatan} disabled={savingCatatan} className="text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"><Save className="w-3 h-3" />{savingCatatan ? '...' : 'Simpan'}</button>
                </div>
              )}
            </div>

            {editCatatan ? (
              <textarea
                rows={3}
                value={catatanDraft}
                onChange={(e) => setCatatanDraft(e.target.value)}
                placeholder="contoh: biasanya bayar hari Sabtu sore"
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                autoFocus
              />
            ) : (
              <div className="bg-slate-50 border-l-4 border-emerald-600 p-3 rounded-r-xl text-xs text-slate-700 leading-relaxed italic whitespace-pre-line">
                {pelanggan.catatan_pribadi ? `"${pelanggan.catatan_pribadi}"` : 'Belum ada catatan. Klik Edit untuk menambah (misal: kebiasaan bayar).'}
              </div>
            )}

            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Hanya terlihat oleh pengelola warung ({namaPemilik})</span>
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
              {barangFavorit.length === 0 && <p className="text-center text-slate-400 py-2">Belum ada rincian barang tercatat.</p>}
              {barangFavorit.map((b, i) => (
                <div key={b.nama} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-md font-extrabold text-[10px] flex items-center justify-center shrink-0 ${['bg-sky-100 text-sky-800', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-800'][i]}`}>{i + 1}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{b.nama}</p>
                      <p className="text-[10px] text-slate-400">Frekuensi: {b.jumlah}x transaksi</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 shrink-0">{formatRupiah(b.nominal / b.jumlah)}</span>
                </div>
              ))}
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

      {showEdit && (
        <AddCustomerModal
          initial={pelanggan}
          onClose={() => setShowEdit(false)}
          onSaved={() => { setShowEdit(false); load(); }}
        />
      )}
    </div>
  );
}
