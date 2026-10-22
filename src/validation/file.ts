import type { CekHasil } from './types';

export const MAKS_FOTO_MB = 2;

export function validasiFotoProfil(file: File): CekHasil {
  if (!file.type.startsWith('image/')) return 'File harus berupa gambar (JPG/PNG).';
  if (file.size > MAKS_FOTO_MB * 1024 * 1024) return `Ukuran foto maksimal ${MAKS_FOTO_MB} MB.`;
  return null;
}
