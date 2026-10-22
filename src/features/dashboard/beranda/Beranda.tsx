import React, { useMemo } from 'react';
import type { SaldoPelanggan, Transaksi, Warung } from '../../../lib/types';
import {
  awalBulan, daftarPerluDitagih, perubahanPiutangMingguan, persenLancar,
  saldoBerjalan, startOfDay, sum, topBarang, totalPiutang,
} from '../../../lib/analytics';
import SapaanHeader from './SapaanHeader';
import KartuMetrik from './KartuMetrik';
import PerluDitagih from './PerluDitagih';
import AktivitasTerbaru from './AktivitasTerbaru';
import PanelSamping from './PanelSamping';

interface BerandaProps {
  warung: Warung | null;
  saldos: SaldoPelanggan[];
  trans: Transaksi[];
  isLoading: boolean;
  loadError: string;
  onRetry: () => void;
  onOpenRecord: (id?: string, jenis?: 'kasbon' | 'cicilan') => void;
  onOpenCustomer: (id: string) => void;
  onGoLaporan: () => void;
  onGoPelanggan: () => void;
}

// ISO string (UTC) untuk awal hari, offset hari dari hari ini
function addDaysISO(offset: number): string {
  const d = startOfDay();
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

/** Halaman Beranda: ringkasan piutang, tagihan, dan aktivitas terbaru */
export default function Beranda({
  warung, saldos, trans, isLoading, loadError, onRetry, onOpenRecord, onOpenCustomer, onGoLaporan, onGoPelanggan,
}: BerandaProps) {
  // ---------------------------------------------------------- Kalkulasi
  const now = new Date();
  const piutang = totalPiutang(saldos);
  const pelangganAktif = saldos.filter((s) => s.sisa_utang > 0).length;
  const tagihList = daftarPerluDitagih(saldos);
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

  const namaPemilik = warung?.nama_pemilik || 'Juragan';
  const namaWarung = warung?.nama_warung || 'Warung';

  return (
    <>
      {loadError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <button onClick={onRetry} className="font-bold underline cursor-pointer">Coba lagi</button>
        </div>
      )}

      <SapaanHeader
        namaPemilik={namaPemilik}
        namaWarung={namaWarung}
        onOpenRecord={onOpenRecord}
        onGoLaporan={onGoLaporan}
      />

      <KartuMetrik
        isLoading={isLoading}
        piutang={piutang}
        perubahan={perubahan}
        pelangganAktif={pelangganAktif}
        jumlahTagihan={tagihList.length}
        totalTagihan={totalTagihan}
        kasMasukMinggu={kasMasukMinggu}
        jumlahBayarMinggu={jumlahBayarMinggu}
        lancar={lancar}
      />

      <PerluDitagih
        tagihList={tagihList}
        trans={trans}
        warung={warung}
        namaPemilik={namaPemilik}
        isLoading={isLoading}
        onOpenCustomer={onOpenCustomer}
        onLihatSemua={onGoPelanggan}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <AktivitasTerbaru recentTrans={recentTrans} saldoMap={saldoMap} isLoading={isLoading} />
        <PanelSamping barang={barang} namaPemilik={namaPemilik} plafonDefault={warung?.plafon_default} />
      </div>
    </>
  );
}
