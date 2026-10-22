import type { CekHasil } from './types';
import { validasiTeksWajib, validasiWhatsapp } from './kontak';

export const MAKS_NOMINAL = 999_999_999;

export function validasiPelanggan(input: {
  nama: string;
  whatsapp: string;
  batasKasbon: number | null;
}): CekHasil {
  return (
    validasiTeksWajib(input.nama, 'Nama pelanggan') ??
    validasiWhatsapp(input.whatsapp) ??
    (input.batasKasbon !== null && (input.batasKasbon < 0 || input.batasKasbon > MAKS_NOMINAL)
      ? 'Batas kasbon tidak valid.'
      : null)
  );
}
