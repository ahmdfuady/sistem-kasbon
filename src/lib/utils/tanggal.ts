import type { TempoOption } from '../types';

const TZ = 'Asia/Jakarta';

export const formatTanggal = (iso: string | null | undefined): string => {
  if (!iso) return '-';
  // 'YYYY-MM-DD' dianggap tanggal lokal (bukan UTC) supaya tidak mundur sehari
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + 'T00:00:00') : new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: /^\d{4}-\d{2}-\d{2}$/.test(iso) ? undefined : TZ });
};

export const formatTanggalPendek = (iso: string | null | undefined): string => {
  if (!iso) return '-';
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + 'T00:00:00') : new Date(iso);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: /^\d{4}-\d{2}-\d{2}$/.test(iso) ? undefined : TZ });
};

export const formatWaktu = (iso: string): string => {
  const d = new Date(iso);
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ });
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).replace('.', ':');
  return `${tgl}, ${jam} WIB`;
};

// "Hari ini, 09:40" / "Kemarin, 17:30" / "10 Okt, 16:30"
export const formatWaktuRelatif = (iso: string): string => {
  const d = new Date(iso);
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).replace('.', ':');
  const key = (x: Date) => x.toLocaleDateString('en-CA', { timeZone: TZ });
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (key(d) === key(today)) return `Hari ini, ${jam}`;
  if (key(d) === key(yesterday)) return `Kemarin, ${jam}`;
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: TZ });
  return `${tgl}, ${jam}`;
};

export const formatTanggalPanjang = (d: Date = new Date()): string =>
  d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });

// ---------- Tanggal lokal (YYYY-MM-DD) ----------
export const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const todayISO = (): string => toISODate(new Date());

export const addDays = (d: Date, n: number): Date => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

// Akhir bulan berjalan; kalau hari ini sudah akhir bulan -> akhir bulan depan
export const akhirBulan = (from: Date = new Date()): Date => {
  const end = new Date(from.getFullYear(), from.getMonth() + 1, 0);
  if (toISODate(end) <= toISODate(from)) return new Date(from.getFullYear(), from.getMonth() + 2, 0);
  return end;
};

export const hitungJatuhTempo = (opt: TempoOption, kalender?: string, base: Date = new Date()): string => {
  switch (opt) {
    case '3hari':
      return toISODate(addDays(base, 3));
    case '1minggu':
      return toISODate(addDays(base, 7));
    case 'gajian':
      return toISODate(akhirBulan(base));
    case 'kalender':
      return kalender || toISODate(addDays(base, 7));
  }
};

/** "Kamis, 17 Okt 2024" dari 'YYYY-MM-DD' */
export const formatTanggalHari = (iso: string): string =>
  new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
export const jamWib = (iso: string): string =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).replace('.', ':') + ' WIB';

