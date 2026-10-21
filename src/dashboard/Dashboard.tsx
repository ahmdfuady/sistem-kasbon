import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard, Users, PlusCircle, FileSpreadsheet, Settings,
  Search, Bell, User, ChevronDown, ArrowUpRight, ArrowDownRight, TrendingUp,
  AlertCircle, Wallet, CheckCircle, Download, Copy, ExternalLink,
  ArrowRight, ShoppingBag, LogOut, X
} from 'lucide-react';
import { listSaldo, listTransaksi } from '../lib/api';
import type { SaldoPelanggan, Transaksi } from '../lib/types';
import {
  buildPesanTagihan, buildWaLink, formatRupiah, formatTanggalPanjang, formatTanggalPendek,
  formatWaktuRelatif, initials
} from '../lib/format';
import {
  awalBulan, daftarJatuhTempoHariIni, daftarTelat, perubahanPiutangMingguan, persenLancar,
  saldoBerjalan, startOfDay, sum, topBarang, totalPiutang
} from '../lib/analytics';
import { useAuth } from '../context/AuthContext';
import CustomerDetail from './CustomerDetail';
import CustomerList from './CustomerList';
import RecordTransaction from './RecordTransaction';
import FinancialReport from './FinancialReport';
import SettingsView from './SettingsView';

interface DashboardProps {
  onLogout?: () => void;
}

type Menu = 'beranda' | 'pelanggan_list' | 'pelanggan_detail' | 'transaksi' | 'laporan' | 'pengaturan';

const NAV: { id: Menu; icon: any; label: string }[] = [
  { id: 'beranda', icon: LayoutDashboard, label: 'Beranda' },
  { id: 'pelanggan_list', icon: Users, label: 'Buku Pelanggan' },
  { id: 'transaksi', icon: PlusCircle, label: 'Catat Transaksi' },
  { id: 'laporan', icon: FileSpreadsheet, label: 'Laporan Keuangan' },
  { id: 'pengaturan', icon: Settings, label: 'Pengaturan' },
];

const BAR_COLORS = ['bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-indigo-500'];

export default function Dashboard({ onLogout }: DashboardProps) {
  const { warung, user, signOut } = useAuth();

  // Routing Navigation State
  const [activeMenu, setActiveMenu] = useState<Menu>('beranda');
  const [activePelangganId, setActivePelangganId] = useState<string | undefined>(undefined);
  const [activeTransJenis, setActiveTransJenis] = useState<'kasbon' | 'cicilan' | undefined>(undefined);

  // Data dari Supabase
  const [saldos, setSaldos] = useState<SaldoPelanggan[]>([]);
  const [trans, setTrans] = useState<Transaksi[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadError, setLoadError] = useState('');

  // UI state
  const [selectedWaId, setSelectedWaId] = useState<string | null>(null);
  const [copied, setCopied] = useState<'' | 'teks' | 'link'>('');
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showPanduan, setShowPanduan] = useState(false);

  const loadData = async () => {
    setIsLoadingData(true);
    setLoadError('');
    try {
      const [s, t] = await Promise.all([listSaldo(), listTransaksi()]);
      setSaldos(s);
      setTrans(t);
    } catch (e: any) {
      console.error(e);
      setLoadError(e?.message || 'Gagal memuat data dari server.');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (activeMenu === 'beranda') loadData();
  }, [activeMenu]);

  // ---------------------------------------------------------- Kalkulasi
  const now = new Date();
  const piutang = totalPiutang(saldos);
  const pelangganAktif = saldos.filter((s) => s.sisa_utang > 0).length;
  const telatList = daftarTelat(saldos);
  const dueToday = daftarJatuhTempoHariIni(saldos);
  const tagihList = [...telatList, ...dueToday];
  const totalTagihan = tagihList.reduce((a, s) => a + s.sisa_utang, 0);
  const lancar = persenLancar(saldos);
  const perubahan = perubahanPiutangMingguan(saldos, trans);

  const mulaiMinggu = addDaysISO(-6);
  const weekTrans = trans.filter((t) => t.created_at >= mulaiMinggu);
  const kasMasukMinggu = sum(weekTrans, 'cicilan');
  const jumlahBayarMinggu = weekTrans.filter((t) => t.jenis === 'cicilan').length;

  const bulanIni = awalBulan(now.getFullYear(), now.getMonth()).toISOString();
  const barang = useMemo(() => topBarang(trans.filter((t) => t.created_at >= bulanIni), 4), [trans, bulanIni]);

  const saldoMap = useMemo(() => saldoBerjalan(trans), [trans]);
  const recentTrans = trans.slice(0, 4);

  const selected = tagihList.find((s) => s.pelanggan_id === selectedWaId) ?? tagihList[0] ?? null;

  const namaPemilik = warung?.nama_pemilik || 'Juragan';
  const namaWarung = warung?.nama_warung || 'Warung';

  const waText = selected && warung
    ? buildPesanTagihan({
        template: warung.template_wa,
        namaWarga: selected.nama,
        namaWarung: warung.nama_warung,
        namaPemilik: warung.nama_pemilik,
        nominal: selected.sisa_utang,
        jatuhTempo: selected.jatuh_tempo_terakhir,
        catatanStruk: warung.catatan_struk,
      })
    : '';

  const waLinkFor = (s: SaldoPelanggan) =>
    buildWaLink(
      s.whatsapp,
      warung
        ? buildPesanTagihan({
            template: warung.template_wa,
            namaWarga: s.nama,
            namaWarung: warung.nama_warung,
            namaPemilik: warung.nama_pemilik,
            nominal: s.sisa_utang,
            jatuhTempo: s.jatuh_tempo_terakhir,
            catatanStruk: warung.catatan_struk,
          })
        : ''
    );

  const lastKasbonOf = (pid: string) => trans.find((t) => t.pelanggan_id === pid && t.jenis === 'kasbon');

  const copy = (text: string, kind: 'teks' | 'link') => {
    navigator.clipboard?.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(''), 2000);
  };

  // ---------------------------------------------------------- Navigasi
  const goMenu = (m: Menu) => {
    setActiveMenu(m);
    setActivePelangganId(undefined);
    setActiveTransJenis(undefined);
  };

  const handleOpenRecord = (id?: string, jenis?: 'kasbon' | 'cicilan') => {
    setActivePelangganId(id);
    setActiveTransJenis(jenis);
    setActiveMenu('transaksi');
  };

  const handleOpenCustomer = (id: string) => {
    setActivePelangganId(id);
    setActiveMenu('pelanggan_detail');
    setShowSearch(false);
    setShowNotif(false);
    setQuery('');
  };

  // ---------------------------------------------------------- Pencarian header
  const q = query.trim().toLowerCase();
  const hasilPelanggan = q
    ? saldos.filter((s) => s.nama.toLowerCase().includes(q) || s.kode.toLowerCase().includes(q) || (s.whatsapp ?? '').includes(q)).slice(0, 5)
    : [];
  const hasilBarang = q
    ? trans.filter((t) => (t.barang ?? '').toLowerCase().includes(q)).slice(0, 5)
    : [];

  const isActive = (id: Menu) => activeMenu === id || (activeMenu === 'pelanggan_detail' && id === 'pelanggan_list');
  const doLogout = onLogout ?? signOut;

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex font-sans text-slate-800">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shadow-emerald-600/30">K</div>
            <div>
              <div className="flex items-center gap-1.5"><span className="font-extrabold text-slate-900 tracking-tight text-base">KasbonKu</span></div>
              <p className="text-[10px] text-slate-400 font-medium">Buku Kas Warung</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => goMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                  isActive(item.id) ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <span className="text-emerald-700">🏪</span>
              <span>Bantuan Warung</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">Butuh bantuan mencatat? Hubungi panduan kilat kami.</p>
            <button onClick={() => setShowPanduan(true)} className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px] cursor-pointer">
              <span>Buka Panduan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <button onClick={() => doLogout?.()} className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun Warung</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* TOP BAR */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shrink-0 max-w-[55%] sm:max-w-none">
              <span className="text-emerald-600">🏪</span>
              <span className="truncate">{namaWarung}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </div>

            <div className="relative max-w-md w-full hidden sm:block">
              <span className="absolute left-3 top-2.5 text-slate-400"><Search className="w-3.5 h-3.5" /></span>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                placeholder="Cari nama pelanggan atau barang..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
              {showSearch && q && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSearch(false)} />
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-72 overflow-y-auto text-xs">
                    {hasilPelanggan.length === 0 && hasilBarang.length === 0 && (
                      <p className="p-3 text-center text-slate-400">Tidak ditemukan.</p>
                    )}
                    {hasilPelanggan.map((s) => (
                      <button key={s.pelanggan_id} onClick={() => handleOpenCustomer(s.pelanggan_id)} className="w-full text-left p-3 hover:bg-emerald-50 border-b border-slate-100 flex justify-between items-center cursor-pointer">
                        <span className="font-bold text-slate-800">{s.nama} <span className="font-mono text-[10px] text-slate-400 ml-1">{s.kode}</span></span>
                        <span className={`font-bold ${s.sisa_utang > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{formatRupiah(s.sisa_utang)}</span>
                      </button>
                    ))}
                    {hasilBarang.map((t) => (
                      <button key={t.id} onClick={() => handleOpenCustomer(t.pelanggan_id)} className="w-full text-left p-3 hover:bg-emerald-50 border-b border-slate-100 cursor-pointer">
                        <p className="font-bold text-slate-800 flex items-center gap-1"><ShoppingBag className="w-3 h-3 text-slate-400" /> {t.barang}</p>
                        <p className="text-[10px] text-slate-400">{t.pelanggan?.nama} • {formatWaktuRelatif(t.created_at)}</p>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotif((v) => !v)}
                className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {tagihList.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>}
              </button>
              {showNotif && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg text-xs overflow-hidden">
                    <p className="px-3 py-2.5 font-extrabold text-slate-900 border-b border-slate-100">Pengingat Jatuh Tempo</p>
                    {tagihList.length === 0 && <p className="p-4 text-center text-slate-400">Tidak ada yang menunggak. 🎉</p>}
                    {tagihList.slice(0, 6).map((s) => (
                      <button key={s.pelanggan_id} onClick={() => handleOpenCustomer(s.pelanggan_id)} className="w-full text-left px-3 py-2.5 hover:bg-rose-50/50 border-b border-slate-100 flex items-center justify-between cursor-pointer">
                        <span>
                          <span className="font-bold text-slate-800 block">{s.nama}</span>
                          <span className="text-[10px] text-rose-600 font-bold">{s.hari_telat > 0 ? `Telat ${s.hari_telat} hari` : 'Jatuh tempo hari ini'}</span>
                        </span>
                        <span className="font-black text-rose-600">{formatRupiah(s.sisa_utang)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-extrabold text-slate-900 leading-tight">{namaPemilik}</p>
                <p className="text-[10px] text-slate-400 font-medium">Pemilik Warung</p>
              </div>
              {warung?.foto_url ? (
                <img src={warung.foto_url} alt="Foto warung" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs"><User className="w-4 h-4" /></div>
              )}
            </div>
          </div>
        </header>

        {/* NAV MOBILE */}
        <div className="md:hidden bg-white border-b border-slate-200/80 px-3 py-2 flex gap-1.5 overflow-x-auto text-[11px] font-bold">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => goMenu(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${isActive(item.id) ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={() => doLogout?.()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap bg-rose-50 text-rose-600 cursor-pointer">
            <LogOut className="w-3.5 h-3.5" /><span>Keluar</span>
          </button>
        </div>

        {/* BODY CONTAINER */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">

          {activeMenu === 'pengaturan' ? (
            <SettingsView />
          ) : activeMenu === 'laporan' ? (
            <FinancialReport />
          ) : activeMenu === 'transaksi' ? (
            <RecordTransaction
              key={`${activePelangganId ?? ''}-${activeTransJenis ?? ''}`}
              initialPelangganId={activePelangganId}
              initialJenis={activeTransJenis}
              onBackToDashboard={() => goMenu('beranda')}
              onOpenCustomer={handleOpenCustomer}
            />
          ) : activeMenu === 'pelanggan_list' ? (
            <CustomerList onOpen={handleOpenCustomer} onRecord={handleOpenRecord} />
          ) : activeMenu === 'pelanggan_detail' && activePelangganId ? (
            <CustomerDetail
              pelangganId={activePelangganId}
              onBackToDashboard={() => goMenu('pelanggan_list')}
              onRecordTransaction={handleOpenRecord}
            />
          ) : (
            /* DEFAULT: BERANDA */
            <>
              {loadError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <span>{loadError}</span>
                  <button onClick={loadData} className="font-bold underline cursor-pointer">Coba lagi</button>
                </div>
              )}

              {/* SECTION HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
                    <span>🗓️ {formatTanggalPanjang(now)}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      Toko Buka • {now.getHours() < 11 ? 'Sesi Pagi' : now.getHours() < 15 ? 'Sesi Siang' : now.getHours() < 18 ? 'Sesi Sore' : 'Sesi Malam'}
                    </span>
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">Halo, {namaPemilik} 👋</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ringkasan kasbon & piutang harian <span className="font-bold text-slate-700">{namaWarung}</span> terdata rapi hari ini.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => handleOpenRecord(undefined, 'kasbon')} className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
                    <span>+ Catat Utang Baru</span>
                  </button>
                  <button onClick={() => handleOpenRecord(undefined, 'cicilan')} className="bg-[#05603a] hover:bg-[#044e2f] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer">
                    <span>+ Terima Bayar / Cicilan</span>
                  </button>
                  <button onClick={() => goMenu('laporan')} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export Laporan</span>
                  </button>
                </div>
              </div>

              {/* 4 METRICS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Total Piutang Berjalan</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoadingData ? '...' : formatRupiah(piutang)}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center"><Wallet className="w-4 h-4" /></div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    {perubahan === null ? (
                      <span className="text-slate-400 text-[11px]">Belum ada pembanding</span>
                    ) : (
                      <span className={`${perubahan > 0 ? 'text-rose-600' : 'text-emerald-600'} font-bold text-[11px] flex items-center gap-0.5`}>
                        {perubahan > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {perubahan > 0 ? '+' : ''}{perubahan}% <span className="text-slate-400 font-normal">vs minggu lalu</span>
                      </span>
                    )}
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{pelangganAktif} Pelanggan</span>
                  </div>
                </div>

                <div className="bg-rose-50/70 p-5 rounded-2xl border border-rose-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-rose-600 text-[11px] font-bold"><AlertCircle className="w-3.5 h-3.5" /><span>Jatuh Tempo</span></div>
                      <p className="text-2xl font-black text-rose-600 mt-1 tracking-tight">{tagihList.length} Orang</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center"><Bell className="w-4 h-4" /></div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs">
                    <span className="text-rose-700 font-bold text-[11px]">Total: {formatRupiah(totalTagihan)}</span>
                    {tagihList.length > 0 && <span className="bg-rose-200/70 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-md">Prioritas</span>}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Kas Masuk Minggu Ini</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{isLoadingData ? '...' : formatRupiah(kasMasukMinggu)}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">{jumlahBayarMinggu} transaksi lunas/cicil</span>
                    {jumlahBayarMinggu > 0 && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">✓ Tertib</span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400">Kelancaran Bayar</p>
                      <p className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{lancar}%</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${lancar}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400">Pelanggan tertib tepat waktu</p>
                  </div>
                </div>
              </div>

              {/* PERLU SEGERA DITAGIH & WA SENDER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                      <h3 className="font-extrabold text-sm text-slate-900">Perlu Segera Ditagih</h3>
                      <span className="bg-rose-100 text-rose-700 font-bold text-[10px] px-2 py-0.5 rounded-full">{tagihList.length} Orang</span>
                    </div>
                    <button onClick={() => goMenu('pelanggan_list')} className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer">
                      <span>Lihat Semua Pelanggan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {tagihList.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">{isLoadingData ? 'Memuat data...' : 'Tidak ada yang menunggak. Semua lancar! 🎉'}</p>
                    )}
                    {tagihList.slice(0, 5).map((s) => {
                      const last = lastKasbonOf(s.pelanggan_id);
                      const telat = s.hari_telat > 0;
                      const aktif = selected?.pelanggan_id === s.pelanggan_id;
                      return (
                        <div
                          key={s.pelanggan_id}
                          onClick={() => setSelectedWaId(s.pelanggan_id)}
                          className={`p-4 rounded-xl border bg-slate-50/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            aktif ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-full font-black text-xs flex items-center justify-center shrink-0 ${telat ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'}`}>{initials(s.nama)}</div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <button onClick={(e) => { e.stopPropagation(); handleOpenCustomer(s.pelanggan_id); }} className="font-bold text-slate-900 text-xs sm:text-sm hover:underline cursor-pointer">{s.nama}</button>
                                <span className={`${telat ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'} text-[10px] font-bold px-2 py-0.5 rounded`}>
                                  {telat ? `Telat ${s.hari_telat} Hari` : 'Jatuh Tempo Hari Ini'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">({s.kode}{s.whatsapp ? ` • ${s.whatsapp}` : ' • belum ada nomor WA'})</p>
                              {last && (
                                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                                  <ShoppingBag className="w-3 h-3 text-slate-400" />
                                  <span>Terakhir: {formatTanggalPendek(last.created_at)} • {last.barang || last.catatan || 'Kasbon'}</span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-medium">Total Kasbon</p>
                              <p className="text-sm sm:text-base font-black text-rose-600">{formatRupiah(s.sisa_utang)}</p>
                            </div>
                            <a
                              href={waLinkFor(s)}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Buka wa.me</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 text-lg">💬</span>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Tagihan WA {warung?.template_wa === 'formal' ? 'Formal' : 'Santun'}</h3>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">Link Manual wa.me</span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Buka link <span className="font-mono text-emerald-700 font-bold">wa.me/62...</span> langsung ke aplikasi/web WhatsApp HP pribadi {namaPemilik} dengan teks pesan yang sudah terisi otomatis (100% gratis tanpa biaya API).
                  </p>

                  {selected ? (
                    <>
                      <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 space-y-2">
                        <p className="text-[10px] font-bold text-emerald-900 flex items-center gap-1"><span>❝</span> Pratinjau Pesan ({selected.nama}):</p>
                        <p className="text-xs text-slate-700 italic leading-relaxed whitespace-pre-line">{waText}</p>
                      </div>

                      <button
                        onClick={() => window.open(waLinkFor(selected), '_blank')}
                        className="w-full bg-[#25d366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Buka wa.me di WhatsApp</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button onClick={() => copy(waText, 'teks')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer">
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>{copied === 'teks' ? 'Tersalin! ✓' : 'Salin Teks Pesan'}</span>
                        </button>
                        <button onClick={() => copy(waLinkFor(selected), 'link')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2 px-3 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          <span>{copied === 'link' ? 'Tersalin! ✓' : 'Salin Link wa.me'}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">Belum ada tagihan yang perlu dikirim.</p>
                  )}
                </div>
              </div>

              {/* SECTION BAWAH */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700">⏱️</span>
                      <h3 className="font-extrabold text-sm text-slate-900">Aktivitas Transaksi Terbaru</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Update Otomatis</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-bold">
                          <th className="pb-3 font-semibold">Pelanggan</th>
                          <th className="pb-3 font-semibold">Rincian Barang</th>
                          <th className="pb-3 font-semibold">Waktu</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Nominal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {recentTrans.length === 0 && (
                          <tr><td colSpan={5} className="py-6 text-center text-slate-400">{isLoadingData ? 'Memuat data...' : 'Belum ada transaksi'}</td></tr>
                        )}
                        {recentTrans.map((t) => {
                          const sesudah = saldoMap.get(t.id)?.sesudah ?? 1;
                          const lunas = t.jenis === 'cicilan' && sesudah <= 0;
                          return (
                            <tr key={t.id}>
                              <td className="py-3.5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full font-bold text-[10px] flex items-center justify-center ${t.jenis === 'cicilan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                                    {initials(t.pelanggan?.nama ?? '?')}
                                  </div>
                                  <span className="font-bold text-slate-800">{t.pelanggan?.nama}</span>
                                </div>
                              </td>
                              <td className="py-3.5 text-slate-600 truncate max-w-[180px]">{t.barang || t.catatan || '-'}</td>
                              <td className="py-3.5 text-slate-400 text-[11px]">{formatWaktuRelatif(t.created_at)}</td>
                              <td className="py-3.5">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.jenis === 'cicilan' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                                  {t.jenis === 'cicilan' ? (lunas ? '✓ Lunas' : 'Cicilan Masuk') : 'Kasbon Baru'}
                                </span>
                              </td>
                              <td className={`py-3.5 text-right font-extrabold ${t.jenis === 'cicilan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {t.jenis === 'cicilan' ? '+' : '-'}{formatRupiah(t.nominal)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700">📦</span>
                        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">Barang Sering Dikasbon</h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Bulan Ini</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {barang.items.length === 0 && <p className="text-center text-slate-400 py-3">Belum ada data barang bulan ini.</p>}
                      {barang.items.map((b, i) => {
                        const pct = barang.totalJumlah ? Math.round((b.jumlah / barang.totalJumlah) * 100) : 0;
                        return (
                          <div key={b.nama}>
                            <div className="flex justify-between font-bold text-slate-700 mb-1">
                              <span className="truncate pr-2">{b.nama}</span>
                              <span className="text-slate-900 font-extrabold">{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`${BAR_COLORS[i % BAR_COLORS.length]} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#064e3b] to-[#043d2e] text-white rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
                      <span>💡 Tips {namaPemilik} Pekan Ini</span>
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base leading-snug">
                      {warung?.plafon_default
                        ? `Plafon Kasbon Maksimal ${formatRupiah(warung.plafon_default)} per Warga`
                        : 'Tetapkan Plafon Kasbon per Warga'}
                    </h4>
                    <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                      Jangan ragu menahan kasbon baru bila tagihan minggu lalu belum dilunasi minimal 50%. Catatan rapi bikin warung panjang umur!
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* MODAL PANDUAN */}
      {showPanduan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPanduan(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">Panduan Kilat KasbonKu</h3>
              <button onClick={() => setShowPanduan(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>Tambahkan warga di menu <strong>Buku Pelanggan</strong> (isi nomor WhatsApp supaya bisa menagih).</li>
              <li>Saat warga ngutang, buka <strong>Catat Transaksi</strong> → pilih warga → isi nominal & janji bayar.</li>
              <li>Saat warga bayar, pilih <strong>Terima Bayar / Cicilan</strong>. Kwitansi otomatis bernomor.</li>
              <li>Di <strong>Beranda</strong>, warga yang telat muncul di "Perlu Segera Ditagih". Klik <strong>Buka wa.me</strong> untuk kirim pengingat santun.</li>
              <li>Atur plafon, template WA, dan cadangan data di <strong>Pengaturan</strong>.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

// ISO string (UTC) untuk awal hari, offset hari dari hari ini
function addDaysISO(offset: number): string {
  const d = startOfDay();
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

