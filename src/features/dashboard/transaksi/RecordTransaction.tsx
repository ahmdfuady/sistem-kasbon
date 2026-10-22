import React, { useEffect, useMemo, useState } from 'react';
import { createTransaksi, listSaldo, listTransaksi, nextNoKwitansi } from '../../../api';
import type { SaldoPelanggan, TempoOption } from '../../../lib/types';
import { buildKwitansi, buildNotaKasbon, hitungJatuhTempo, todayISO } from '../../../lib/utils';
import { daftarTempoDalam, startOfDay, sum, totalPiutang } from '../../../lib/analytics';
import { useAuth } from '../../auth/AuthContext';
import { validasiTransaksi } from '../../../validation';
import AddCustomerModal from '../../../components/AddCustomerModal';
import KasirHeader from './form/KasirHeader';
import ModeSwitcher from './form/ModeSwitcher';
import PilihPelanggan from './form/PilihPelanggan';
import InputNominal from './form/InputNominal';
import PilihTanggal from './form/PilihTanggal';
import JatuhTempoAtauMetode from './form/JatuhTempoAtauMetode';
import RincianBarang from './form/RincianBarang';
import RingkasanCatatan from './form/RingkasanCatatan';
import TombolAksi from './form/TombolAksi';
import KartuStatBawah from './form/KartuStatBawah';
import HasilModal, { type Hasil } from './form/HasilModal';

interface RecordTransactionProps {
  onBackToDashboard: () => void;
  initialPelangganId?: string;
  initialJenis?: 'kasbon' | 'cicilan';
  onOpenCustomer?: (id: string) => void;
}

/** Halaman catat transaksi: kasbon baru atau terima pembayaran/cicilan */
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

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [hasil, setHasil] = useState<Hasil | null>(null);

  const [customers, setCustomers] = useState<SaldoPelanggan[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialPelangganId ?? null);
  const [setoranHariIni, setSetoranHariIni] = useState(0);

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

  const stat = {
    beredar: totalPiutang(customers),
    tempoMinggu: daftarTempoDalam(customers, 7).length,
  };

  // ---------------------------------------------------------- Aksi
  const changeType = (t: 'kasbon' | 'cicilan') => {
    setTransactionType(t);
    setError('');
  };
  const selectPelanggan = (id: string) => {
    setSelectedId(id);
    setError('');
  };
  const appendItem = (item: string) => setItemsText((prev) => (prev ? `${prev}, ${item}` : item));
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


  return (
    <div className="space-y-6">
      <KasirHeader />

      <ModeSwitcher transactionType={transactionType} onChange={changeType} />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ================= KOLOM KIRI ================= */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <PilihPelanggan
            customers={customers}
            selectedPelanggan={selectedPelanggan}
            utangSebelumnya={utangSebelumnya}
            transactionType={transactionType}
            terkunci={terkunci}
            onSelect={selectPelanggan}
            onAddNew={() => setShowAdd(true)}
          />
          <InputNominal
            transactionType={transactionType}
            nominal={nominal}
            onNominalChange={setNominal}
            utangSebelumnya={utangSebelumnya}
          />
          <PilihTanggal tanggal={tanggal} onTanggalChange={setTanggal} />
          <JatuhTempoAtauMetode
            transactionType={transactionType}
            tanggal={tanggal}
            tempoOption={tempoOption}
            onTempoOptionChange={setTempoOption}
            kalenderDate={kalenderDate}
            onKalenderDateChange={setKalenderDate}
            metode={metode}
            onMetodeChange={setMetode}
          />
        </div>

        {/* ================= KOLOM KANAN ================= */}
        <div className="lg:col-span-5 space-y-4">
          <RincianBarang
            transactionType={transactionType}
            itemsText={itemsText}
            onItemsChange={setItemsText}
            catatanKasbon={catatanKasbon}
            onCatatanKasbonChange={setCatatanKasbon}
            onAppendItem={appendItem}
          />
          <RingkasanCatatan
            transactionType={transactionType}
            selectedPelanggan={selectedPelanggan}
            onOpenCustomer={onOpenCustomer}
            utangSebelumnya={utangSebelumnya}
            nominal={nominal}
            batasKasbon={batasKasbon}
            rasioBatas={rasioBatas}
            totalUtangBaru={totalUtangBaru}
            jatuhTempo={jatuhTempo}
          />
        </div>

        {error && (
          <div className="lg:col-span-12 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl px-4 py-3">{error}</div>
        )}

        <TombolAksi transactionType={transactionType} isSaving={isSaving} onBack={onBackToDashboard} onReset={reset} />
      </form>

      <KartuStatBawah beredar={stat.beredar} setoranHariIni={setoranHariIni} tempoMinggu={stat.tempoMinggu} />

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
      {hasil && <HasilModal hasil={hasil} onCatatLagi={catatLagi} onSelesai={onBackToDashboard} />}
    </div>
  );
}
