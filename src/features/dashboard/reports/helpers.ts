import type { Transaksi } from '../../../lib/types';
import { labelMetode, labelTempo, toISODate } from '../../../lib/utils';

/** Jumlah baris per halaman di tabel rekap */
export const PER_HALAMAN = 10;

/** 'YYYY-MM' dari sebuah tanggal ISO */
export const monthKey = (iso: string): string => toISODate(new Date(iso)).slice(0, 7);

/** 150000 -> "150rb" (label sumbu grafik) */
export const rb = (n: number): string => (n >= 1000 ? `${Math.round(n / 1000)}rb` : String(Math.round(n)));

type SaldoMap = Map<string, { sebelum: number; sesudah: number }>;

/** Label & warna status satu transaksi (tempo / lunas / cicilan %) */
export const infoStatus = (t: Transaksi, saldoMap: SaldoMap) => {
  const s = saldoMap.get(t.id);
  if (t.jenis === 'kasbon') return { teks: labelTempo(t.tempo_option), warna: 'bg-rose-100 text-rose-700' };
  if (s && s.sesudah <= 0) return { teks: `Lunas ${labelMetode(t.metode_bayar)}`, warna: 'bg-emerald-100 text-emerald-800' };
  const pct = s && s.sebelum > 0 ? Math.round((t.nominal / s.sebelum) * 100) : 0;
  return { teks: `Cicilan ${pct}%`, warna: 'bg-sky-100 text-sky-800' };
};
