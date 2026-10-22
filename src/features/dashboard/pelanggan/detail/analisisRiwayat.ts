import type { Transaksi } from '../../../../lib/types';
import { pecahBarang } from '../../../../lib/utils';

type SaldoMap = Map<string, { sebelum: number; sesudah: number }>;

export type StatusKasbon = Map<string, { terbayar: number; sisa: number }>;

export interface BarangFavorit {
  nama: string;
  jumlah: number;
  nominal: number;
}

export interface PolaKasbonInfo {
  teks: string;
  path: string;
  last: { x: number; y: number };
}

/** Alokasi pembayaran ke kasbon secara urut (FIFO) untuk status tiap kasbon */
export function hitungStatusKasbon(transaksiList: Transaksi[]): StatusKasbon {
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
}

/** 3 barang yang paling sering diambil pelanggan ini */
export function hitungBarangFavorit(transaksiList: Transaksi[]): BarangFavorit[] {
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
}

/** Teks kebiasaan membayar + garis grafik mini saldo utang */
export function hitungPola(transaksiList: Transaksi[], saldoMap: SaldoMap): PolaKasbonInfo {
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
}
