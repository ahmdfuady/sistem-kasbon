import { useEffect, useState } from 'react';
import { listSaldo, listTransaksi } from '../../api';
import type { SaldoPelanggan, Transaksi } from '../../lib/types';
import { daftarPerluDitagih } from '../../lib/analytics';
import { useAuth } from '../auth/AuthContext';
import type { Menu } from './menu';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MobileNav from './components/MobileNav';
import GuideModal from './components/GuideModal';
import Beranda from './beranda/Beranda';
import CustomerDetail from './pelanggan/CustomerDetail';
import CustomerList from './pelanggan/CustomerList';
import RecordTransaction from './transaksi/RecordTransaction';
import FinancialReport from './laporan/FinancialReport';
import SettingsView from './pengaturan/SettingsView';

interface DashboardProps {
  onLogout?: () => void;
}

/**
 * Kerangka dashboard: sidebar + top bar + satu halaman aktif di tengah.
 * Data pelanggan & transaksi dimuat di sini, lalu dibagikan ke Beranda dan pencarian.
 */
export default function Dashboard({ onLogout }: DashboardProps) {
  const { warung, signOut } = useAuth();

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

  const isActive = (id: Menu) => activeMenu === id || (activeMenu === 'pelanggan_detail' && id === 'pelanggan_list');
  const doLogout = onLogout ?? signOut;

  return (
    <div className="h-screen overflow-hidden bg-[#f4f7f6] flex font-sans text-slate-800">
      <Sidebar
        isActive={isActive}
        onNavigate={goMenu}
        onOpenGuide={() => setShowPanduan(true)}
        onLogout={() => doLogout?.()}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <TopBar
          namaWarung={warung?.nama_warung || 'Warung'}
          namaPemilik={warung?.nama_pemilik || 'Juragan'}
          fotoUrl={warung?.foto_url}
          saldos={saldos}
          trans={trans}
          tagihList={daftarPerluDitagih(saldos)}
          query={query}
          onQueryChange={setQuery}
          showSearch={showSearch}
          onShowSearchChange={setShowSearch}
          showNotif={showNotif}
          onShowNotifChange={setShowNotif}
          onOpenCustomer={handleOpenCustomer}
        />

        <MobileNav isActive={isActive} onNavigate={goMenu} onLogout={() => doLogout?.()} />

        {/* Halaman aktif */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
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
            <Beranda
              warung={warung}
              saldos={saldos}
              trans={trans}
              isLoading={isLoadingData}
              loadError={loadError}
              onRetry={loadData}
              onOpenRecord={handleOpenRecord}
              onOpenCustomer={handleOpenCustomer}
              onGoLaporan={() => goMenu('laporan')}
              onGoPelanggan={() => goMenu('pelanggan_list')}
            />
          )}
        </main>
      </div>

      {showPanduan && <GuideModal onClose={() => setShowPanduan(false)} />}
    </div>
  );
}
