import type { SaldoPelanggan, Transaksi } from './types';
import { addDays, pecahBarang, toISODate } from './format';

export const dayKey = (iso: string): string => toISODate(new Date(iso));

export const startOfDay = (d: Date = new Date()): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------- barang favorit
export interface BarangStat {
  nama: string;
  jumlah: number;
  nominal: number;
}
export interface BarangHasil {
  items: BarangStat[];
  totalJumlah: number;
  totalNominal: number;
}

/** Hitung barang yang paling sering dikasbon dari kolom `barang` (nominal dibagi rata per barang) */
export function topBarang(trans: Transaksi[], limit = 4): BarangHasil {
  const map = new Map<string, BarangStat>();
  let totalJumlah = 0;
  let totalNominal = 0;
  for (const t of trans) {
    if (t.jenis !== 'kasbon') continue;
    const items = pecahBarang(t.barang);
    if (!items.length) continue;
    const share = t.nominal / items.length;
    for (const raw of items) {
      const key = raw.toLowerCase().replace(/\s+/g, ' ');
      const cur = map.get(key) ?? { nama: cap(raw), jumlah: 0, nominal: 0 };
      cur.jumlah += 1;
      cur.nominal += share;
      map.set(key, cur);
      totalJumlah += 1;
      totalNominal += share;
    }
  }
  const items = [...map.values()].sort((a, b) => b.jumlah - a.jumlah || b.nominal - a.nominal).slice(0, limit);
  return { items, totalJumlah, totalNominal };
}

// ---------------------------------------------------------- saldo berjalan
/** Saldo utang pelanggan sebelum/sesudah tiap transaksi (urut waktu per pelanggan) */
export function saldoBerjalan(trans: Transaksi[]): Map<string, { sebelum: number; sesudah: number }> {
  const out = new Map<string, { sebelum: number; sesudah: number }>();
  const byCust = new Map<string, Transaksi[]>();
  for (const t of trans) {
    const arr = byCust.get(t.pelanggan_id) ?? [];
    arr.push(t);
    byCust.set(t.pelanggan_id, arr);
  }
  byCust.forEach((arr) => {
    arr.sort((a, b) => a.created_at.localeCompare(b.created_at));
    let saldo = 0;
    for (const t of arr) {
      const sebelum = saldo;
      saldo += t.jenis === 'kasbon' ? t.nominal : -t.nominal;
      out.set(t.id, { sebelum, sesudah: saldo });
    }
  });
  return out;
}

// ---------------------------------------------------------- ringkasan umum
export const sum = (trans: Transaksi[], jenis: 'kasbon' | 'cicilan'): number =>
  trans.filter((t) => t.jenis === jenis).reduce((a, t) => a + t.nominal, 0);

export const totalPiutang = (saldos: SaldoPelanggan[]): number =>
  saldos.reduce((a, s) => a + Math.max(s.sisa_utang, 0), 0);

/** Pelanggan yang punya utang & sudah lewat jatuh tempo */
export const daftarTelat = (saldos: SaldoPelanggan[]): SaldoPelanggan[] =>
  saldos.filter((s) => s.sisa_utang > 0 && s.hari_telat > 0).sort((a, b) => b.hari_telat - a.hari_telat);

/** Pelanggan yang punya utang & jatuh tempo tepat hari ini */
export const daftarJatuhTempoHariIni = (saldos: SaldoPelanggan[]): SaldoPelanggan[] => {
  const today = toISODate(new Date());
  return saldos.filter((s) => s.sisa_utang > 0 && s.hari_telat === 0 && s.jatuh_tempo_terakhir === today);
};

/** Pelanggan berutang dengan jatuh tempo dalam `hari` ke depan (atau sudah lewat) */
export const daftarTempoDalam = (saldos: SaldoPelanggan[], hari = 7): SaldoPelanggan[] => {
  const batas = toISODate(addDays(new Date(), hari));
  return saldos.filter((s) => s.sisa_utang > 0 && !!s.jatuh_tempo_terakhir && s.jatuh_tempo_terakhir <= batas);
};

/** % pelanggan berutang yang tidak telat (100 kalau tidak ada yang berutang) */
export const persenLancar = (saldos: SaldoPelanggan[]): number => {
  const berutang = saldos.filter((s) => s.sisa_utang > 0);
  if (!berutang.length) return 100;
  const lancar = berutang.filter((s) => s.hari_telat <= 0).length;
  return Math.round((lancar / berutang.length) * 100);
};

/** Perubahan % piutang dibanding 7 hari lalu (null kalau tidak bisa dihitung) */
export function perubahanPiutangMingguan(saldos: SaldoPelanggan[], trans: Transaksi[]): number | null {
  const mulai = addDays(startOfDay(), -6).toISOString();
  const minggu = trans.filter((t) => t.created_at >= mulai);
  const net = sum(minggu, 'kasbon') - sum(minggu, 'cicilan');
  const sekarang = totalPiutang(saldos);
  const lalu = sekarang - net;
  if (lalu <= 0) return null;
  return Math.round((net / lalu) * 100);
}

/** Total kasbon vs cicilan per hari untuk N hari terakhir (termasuk hari ini) */
export function arusHarian(trans: Transaksi[], hari = 7) {
  const out: { key: string; label: string; isToday: boolean; masuk: number; kasbon: number }[] = [];
  const today = startOfDay();
  for (let i = hari - 1; i >= 0; i--) {
    const d = addDays(today, -i);
    out.push({
      key: toISODate(d),
      label: i === 0 ? 'Hari Ini' : d.toLocaleDateString('id-ID', { weekday: 'short' }),
      isToday: i === 0,
      masuk: 0,
      kasbon: 0,
    });
  }
  for (const t of trans) {
    const row = out.find((r) => r.key === dayKey(t.created_at));
    if (!row) continue;
    if (t.jenis === 'cicilan') row.masuk += t.nominal;
    else row.kasbon += t.nominal;
  }
  return out;
}

export const awalBulan = (y: number, m: number): Date => new Date(y, m, 1);

export const namaBulan = (y: number, m: number): string =>
  new Date(y, m, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
