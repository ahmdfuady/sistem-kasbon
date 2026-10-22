import type { TempoOption } from '../lib/types';
import { formatRupiah } from '../lib/utils';
import { MAKS_NOMINAL } from './pelanggan';
import type { CekHasil } from './types';

export interface InputTransaksi {
  pelangganDipilih: boolean;
  jenis: 'kasbon' | 'cicilan';
  nominal: number;
  /** sisa utang pelanggan sebelum transaksi ini */
  utangSebelumnya: number;
  /** batas kasbon pelanggan (atau plafon default warung); null = tanpa batas */
  batasKasbon: number | null;
  /** kasbon dikunci karena menunggak > 7 hari */
  terkunci: boolean;
  tempoOption: TempoOption;
  kalenderDate: string;
}

export function validasiTransaksi(i: InputTransaksi): CekHasil {
  if (!i.pelangganDipilih) return 'Pilih pelanggan terlebih dahulu.';
  if (!i.nominal || i.nominal <= 0) return 'Nominal tidak boleh kosong.';
  if (i.nominal > MAKS_NOMINAL) return `Nominal terlalu besar (maksimal ${formatRupiah(MAKS_NOMINAL)}).`;

  if (i.jenis === 'kasbon') {
    if (i.terkunci) {
      return 'Pelanggan ini sedang ditangguhkan karena menunggak lebih dari 7 hari. Minta bayar dulu ya.';
    }
    if (i.batasKasbon && i.utangSebelumnya + i.nominal > i.batasKasbon) {
      return `Kasbon melebihi batas ${formatRupiah(i.batasKasbon)} (utang sekarang ${formatRupiah(i.utangSebelumnya)}).`;
    }
    if (i.tempoOption === 'kalender' && !i.kalenderDate) return 'Pilih tanggal jatuh tempo dulu.';
  } else if (i.nominal > i.utangSebelumnya) {
    return `Pembayaran melebihi sisa utang (${formatRupiah(i.utangSebelumnya)}). Kurangi nominalnya.`;
  }
  return null;
}
