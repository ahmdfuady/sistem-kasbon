export type Plafon = '100' | '200' | '500' | 'unlimited';

/** Nilai angka di database -> pilihan kartu plafon */
export const plafonFromValue = (v: number | null | undefined): Plafon => {
  if (v === null || v === undefined) return 'unlimited';
  if (v === 100000) return '100';
  if (v === 500000) return '500';
  return '200';
};

/** Pilihan kartu plafon -> nilai angka untuk disimpan (null = tanpa batas) */
export const plafonToValue = (p: Plafon): number | null =>
  p === '100' ? 100000 : p === '200' ? 200000 : p === '500' ? 500000 : null;
