import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { deletePelanggan, deleteTransaksi, getPelanggan, getSaldo, listTransaksi } from '../../../api';
import type { Pelanggan, SaldoPelanggan, Transaksi } from '../../../lib/types';
import {
  buildPesanTagihan, buildWaLink, escapeHtml, formatRupiah, formatWaktu,
  formatWaktuRelatif, jamWib, printHtml
} from '../../../lib/utils';
import { saldoBerjalan } from '../../../lib/analytics';
import { useAuth } from '../../auth/AuthContext';
import AddCustomerModal from '../../../components/AddCustomerModal';
import ProfilHeader from './detail/ProfilHeader';
import RiwayatTransaksi from './detail/RiwayatTransaksi';
import PolaKasbon from './detail/PolaKasbon';
import PengingatWA from './detail/PengingatWA';
import CatatanKhusus from './detail/CatatanKhusus';
import BarangFavorit from './detail/BarangFavorit';
import { hitungBarangFavorit, hitungPola, hitungStatusKasbon } from './detail/analisisRiwayat';

interface CustomerDetailProps {
  pelangganId: string;
  onBackToDashboard: () => void;
  onRecordTransaction?: (pelangganId: string, jenis: 'kasbon' | 'cicilan') => void;
}

/** Halaman detail satu pelanggan: profil, riwayat transaksi, pengingat WA, catatan */
export default function CustomerDetail({ pelangganId, onBackToDashboard, onRecordTransaction }: CustomerDetailProps) {
  const { warung } = useAuth();
  const [saldo, setSaldo] = useState<SaldoPelanggan | null>(null);
  const [pelanggan, setPelanggan] = useState<Pelanggan | null>(null);
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);

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
  const statusKasbon = useMemo(() => hitungStatusKasbon(transaksiList), [transaksiList]);
  const barangFavorit = useMemo(() => hitungBarangFavorit(transaksiList), [transaksiList]);
  const pola = useMemo(() => hitungPola(transaksiList, saldoMap), [transaksiList, saldoMap]);
  const terakhirUpdate = transaksiList[0]?.created_at;

  // ---------------------------------------------------------- Aksi
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
  const telat = saldo.sisa_utang > 0 && saldo.hari_telat > 0;
  const terkunci = !!warung?.kunci_kasbon && saldo.hari_telat > 7 && saldo.sisa_utang > 0;
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

      <ProfilHeader
        pelanggan={pelanggan}
        saldo={saldo}
        waLink={waLink}
        terkunci={terkunci}
        onRecordTransaction={onRecordTransaction}
        onCetak={handleCetak}
        onEdit={() => setShowEdit(true)}
        onDelete={handleDeletePelanggan}
      />

      {/* ================= MAIN 2 KOLOM ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* KOLOM KIRI (RIWAYAT TRANSAKSI) */}
        <div className="lg:col-span-8 space-y-4">
          <RiwayatTransaksi
            pelanggan={pelanggan}
            transaksiList={transaksiList}
            statusKasbon={statusKasbon}
            saldoMap={saldoMap}
            onCetak={handleCetak}
            onDeleteTransaksi={handleDeleteTransaksi}
          />
          <PolaKasbon pelanggan={pelanggan} pola={pola} />
        </div>

        {/* KOLOM KANAN */}
        <div className="lg:col-span-4 space-y-4">
          <PengingatWA pelanggan={pelanggan} waMessage={waMessage} waLink={waLink} />
          <CatatanKhusus pelanggan={pelanggan} namaPemilik={namaPemilik} onSaved={setPelanggan} />
          <BarangFavorit barangFavorit={barangFavorit} />

          {/* Footer Cloud Box */}
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
