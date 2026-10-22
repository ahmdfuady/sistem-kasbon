import type { SaldoPelanggan, Transaksi } from '../lib/types';

/** Pembuat data palsu supaya tiap tes cukup menulis field yang penting saja */
export const mkTrans = (over: Partial<Transaksi> = {}): Transaksi => ({
  id: 't1',
  warung_id: 'w1',
  pelanggan_id: 'p1',
  jenis: 'kasbon',
  nominal: 10000,
  barang: null,
  catatan: null,
  tempo_option: null,
  jatuh_tempo: null,
  metode_bayar: null,
  no_kwitansi: null,
  created_at: new Date(2026, 9, 20, 10, 0, 0).toISOString(),
  ...over,
});

export const mkSaldo = (over: Partial<SaldoPelanggan> = {}): SaldoPelanggan => ({
  pelanggan_id: 'p1',
  warung_id: 'w1',
  kode: 'PLG-0001',
  nama: 'Pak Budi',
  whatsapp: null,
  batas_kasbon: null,
  total_kasbon: 0,
  total_bayar: 0,
  sisa_utang: 0,
  jatuh_tempo_terakhir: null,
  hari_telat: 0,
  ...over,
});
