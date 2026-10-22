export const initials = (nama: string): string => {
  const parts = (nama || '?').trim().split(/\s+/);
  const a = parts[0]?.[0] ?? '?';
  const b = parts.length > 1 ? parts[1][0] : parts[0]?.[1] ?? '';
  return (a + b).toUpperCase();
};

export const labelTempo = (opt: string | null | undefined): string => {
  switch (opt) {
    case '3hari': return 'Tempo 3 Hari';
    case '1minggu': return 'Tempo 1 Minggu';
    case 'gajian': return 'Tempo Akhir Bulan';
    case 'kalender': return 'Tempo Tanggal Pilihan';
    default: return 'Kasbon';
  }
};

export const labelMetode = (m: string | null | undefined): string =>
  m === 'qris' ? 'QRIS' : m === 'transfer' ? 'Transfer' : 'Tunai';


// Pecah teks barang "Gula 1kg, Kopi ABC & Rokok" jadi item-item kecil
export const pecahBarang = (barang: string | null | undefined): string[] =>
  (barang || '')
    .split(/,|&|\+|;|\bdan\b/i)
    .map((s) => s.trim())
    .filter(Boolean);
