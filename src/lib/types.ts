export type TemplateWa = 'santun' | 'formal';
export type JenisTransaksi = 'kasbon' | 'cicilan';
export type TempoOption = '3hari' | '1minggu' | 'gajian' | 'kalender';
export type MetodeBayar = 'tunai' | 'transfer' | 'qris';

export interface Warung {
  id: string;
  nama_pemilik: string;
  nama_warung: string;
  whatsapp: string | null;
  alamat: string | null;
  foto_url: string | null;
  catatan_struk: string | null;
  plafon_default: number | null;
  kunci_kasbon: boolean;
  template_wa: TemplateWa;
  created_at: string;
}

export interface Pelanggan {
  id: string;
  warung_id: string;
  kode: string;
  nama: string;
  whatsapp: string | null;
  alamat: string | null;
  catatan_pribadi: string | null;
  batas_kasbon: number | null;
  created_at: string;
}

export interface Transaksi {
  id: string;
  warung_id: string;
  pelanggan_id: string;
  jenis: JenisTransaksi;
  nominal: number;
  barang: string | null;
  catatan: string | null;
  tempo_option: TempoOption | null;
  jatuh_tempo: string | null; // 'YYYY-MM-DD'
  metode_bayar: string | null;
  no_kwitansi: string | null;
  created_at: string;
  // hasil join (opsional)
  pelanggan?: { nama: string; kode: string } | null;
}

// Baris dari view v_saldo_pelanggan
export interface SaldoPelanggan {
  pelanggan_id: string;
  warung_id: string;
  kode: string;
  nama: string;
  whatsapp: string | null;
  batas_kasbon: number | null;
  total_kasbon: number;
  total_bayar: number;
  sisa_utang: number;
  jatuh_tempo_terakhir: string | null;
  hari_telat: number;
}

export interface PelangganInput {
  nama: string;
  whatsapp?: string | null;
  alamat?: string | null;
  catatan_pribadi?: string | null;
  batas_kasbon?: number | null;
}

export interface TransaksiInput {
  pelanggan_id: string;
  jenis: JenisTransaksi;
  nominal: number;
  barang?: string | null;
  catatan?: string | null;
  tempo_option?: TempoOption | null;
  jatuh_tempo?: string | null;
  metode_bayar?: string | null;
  no_kwitansi?: string | null;
  /** opsional: untuk mencatat transaksi dengan tanggal lampau */
  created_at?: string;
}
