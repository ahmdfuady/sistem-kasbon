export const formatRupiah = (n: number | null | undefined): string =>
  'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');


// ---------- Input angka berformat titik ----------
/** "100000" / "100.000" / "1a00" -> "100.000" (hanya angka yang diambil) */
export const formatAngkaInput = (v: string | number): string => {
  const digits = String(v ?? '').replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '';
};

/** "100.000" -> 100000 (string kosong -> 0) */
export const parseAngka = (v: string): number => Number(v.replace(/\D/g, '')) || 0;
