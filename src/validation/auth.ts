import type { CekHasil } from './types';

export const MIN_PANJANG_SANDI = 8;

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validasiEmail(email: string): CekHasil {
  const v = email.trim();
  if (!v) return 'Email wajib diisi.';
  if (!POLA_EMAIL.test(v)) return 'Format email tidak valid.';
  return null;
}

export function validasiSandi(sandi: string): CekHasil {
  if (!sandi) return 'Kata sandi wajib diisi.';
  if (sandi.length < MIN_PANJANG_SANDI) return `Kata sandi minimal ${MIN_PANJANG_SANDI} karakter.`;
  return null;
}

/** Dipakai saat daftar, reset sandi, dan ganti sandi: sandi baru + konfirmasinya */
export function validasiSandiBaru(sandi: string, konfirmasi: string): CekHasil {
  const err = validasiSandi(sandi);
  if (err) return err;
  if (sandi !== konfirmasi) return 'Kata sandi dan konfirmasi tidak cocok.';
  return null;
}
