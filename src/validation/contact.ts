import type { CekHasil } from './types';

/** Ambil angkanya saja: "0812-3456 7890" -> "081234567890" */
export const hanyaAngka = (v: string): string => v.replace(/\D/g, '');

export function validasiWhatsapp(nomor: string, opsi: { wajib?: boolean } = {}): CekHasil {
  const digit = hanyaAngka(nomor);
  if (!digit) return opsi.wajib ? 'Nomor WhatsApp wajib diisi.' : null;
  if (digit.length < 9 || digit.length > 15) return 'Nomor WhatsApp tidak valid (harus 9-15 angka).';
  return null;
}

export function validasiTeksWajib(nilai: string, label: string, maks = 100): CekHasil {
  const v = nilai.trim();
  if (!v) return `${label} wajib diisi.`;
  if (v.length > maks) return `${label} maksimal ${maks} karakter.`;
  return null;
}
