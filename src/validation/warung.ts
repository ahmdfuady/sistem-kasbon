import type { CekHasil } from './types';
import { validasiTeksWajib, validasiWhatsapp } from './kontak';

export function validasiProfilWarung(input: {
  namaWarung: string;
  namaPemilik: string;
  whatsapp: string;
}): CekHasil {
  return (
    validasiTeksWajib(input.namaWarung, 'Nama warung') ??
    validasiTeksWajib(input.namaPemilik, 'Nama pemilik') ??
    validasiWhatsapp(input.whatsapp)
  );
}
