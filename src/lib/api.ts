import { supabase } from './supabase';
import type {
  Pelanggan,
  PelangganInput,
  SaldoPelanggan,
  Transaksi,
  TransaksiInput,
  Warung,
} from './types';

// Semua fungsi melempar Error(message) kalau gagal, jadi cukup try/catch di komponen.
const must = <T,>(data: T | null, error: { message: string } | null): T => {
  if (error) throw new Error(rapikanError(error.message));
  return data as T;
};

/** Pesan error dari database dibuat lebih enak dibaca */
const rapikanError = (msg: string): string => {
  const m = msg.match(/Kasbon melebihi batas pelanggan \(batas Rp ([\d.]+), utang sekarang Rp (-?[\d.]+)\)/);
  if (m) {
    const fmt = (v: string) => 'Rp ' + Math.round(Number(v)).toLocaleString('id-ID');
    return `Kasbon melebihi batas pelanggan (batas ${fmt(m[1])}, utang sekarang ${fmt(m[2])}).`;
  }
  return msg;
};

const num = (v: unknown): number => Number(v ?? 0);

/**
 * ID akun (= id warung) yang sedang login. SEMUA query data wajib difilter dengan ID ini,
 * jadi sebuah akun tidak akan pernah melihat data akun lain, walaupun RLS di database salah konfigurasi.
 */
async function uid(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error('Sesi login berakhir. Silakan masuk lagi.');
  return id;
}

// ---------------------------------------------------------------- WARUNG
const mapWarung = (r: any): Warung => ({
  ...r,
  plafon_default: r.plafon_default === null ? null : num(r.plafon_default),
});

export async function getWarung(userId: string): Promise<Warung | null> {
  const { data, error } = await supabase.from('warung').select('*').eq('id', userId).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapWarung(data) : null;
}

/**
 * Untuk akun lama yang dibuat sebelum trigger handle_new_user dipasang:
 * kalau baris warung belum ada, buat otomatis (butuh policy insert dari kasbonku_migrasi.sql).
 */
export async function ensureWarung(
  userId: string,
  meta: { nama_pemilik?: string; nama_warung?: string; whatsapp?: string }
): Promise<Warung | null> {
  const { data, error } = await supabase
    .from('warung')
    .insert({
      id: userId,
      nama_pemilik: meta.nama_pemilik ?? '',
      nama_warung: meta.nama_warung ?? '',
      whatsapp: meta.whatsapp ?? null,
    })
    .select('*')
    .maybeSingle();
  if (error) return null;
  return data ? mapWarung(data) : null;
}

export async function updateWarung(
  userId: string,
  patch: Partial<Omit<Warung, 'id' | 'created_at'>>
): Promise<Warung> {
  const { data, error } = await supabase.from('warung').update(patch).eq('id', userId).select('*').single();
  return mapWarung(must(data, error));
}

/** Upload foto profil warung ke Supabase Storage (bucket `warung-foto`, publik) */
export async function uploadFotoWarung(userId: string, file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${userId}/foto-${Date.now()}.${ext || 'jpg'}`;
  const { error } = await supabase.storage.from('warung-foto').upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('warung-foto').getPublicUrl(path);
  return data.publicUrl;
}

// ------------------------------------------------------------- PELANGGAN
const mapSaldo = (r: any): SaldoPelanggan => ({
  ...r,
  batas_kasbon: r.batas_kasbon === null ? null : num(r.batas_kasbon),
  total_kasbon: num(r.total_kasbon),
  total_bayar: num(r.total_bayar),
  sisa_utang: num(r.sisa_utang),
  hari_telat: num(r.hari_telat),
});

const mapPelanggan = (r: any): Pelanggan => ({
  ...r,
  batas_kasbon: r.batas_kasbon === null ? null : num(r.batas_kasbon),
});

/** Semua pelanggan + saldo utangnya (dari view v_saldo_pelanggan). */
export async function listSaldo(): Promise<SaldoPelanggan[]> {
  const wid = await uid();
  const { data, error } = await supabase
    .from('v_saldo_pelanggan')
    .select('*')
    .eq('warung_id', wid)
    .order('nama', { ascending: true });
  return must(data, error).map(mapSaldo);
}

export async function getSaldo(pelangganId: string): Promise<SaldoPelanggan | null> {
  const wid = await uid();
  const { data, error } = await supabase
    .from('v_saldo_pelanggan')
    .select('*')
    .eq('warung_id', wid)
    .eq('pelanggan_id', pelangganId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSaldo(data) : null;
}

/** Data lengkap semua pelanggan (alamat, catatan, dll) - dipakai untuk cadangan data */
export async function listPelanggan(): Promise<Pelanggan[]> {
  const wid = await uid();
  const { data, error } = await supabase.from('pelanggan').select('*').eq('warung_id', wid).order('nama', { ascending: true });
  return must(data, error).map(mapPelanggan);
}

export async function getPelanggan(id: string): Promise<Pelanggan | null> {
  const wid = await uid();
  const { data, error } = await supabase.from('pelanggan').select('*').eq('warung_id', wid).eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapPelanggan(data) : null;
}

export async function createPelanggan(input: PelangganInput): Promise<Pelanggan> {
  const wid = await uid();
  const { data, error } = await supabase.from('pelanggan').insert({ ...input, warung_id: wid }).select('*').single();
  return mapPelanggan(must(data, error));
}

export async function updatePelanggan(id: string, patch: Partial<PelangganInput>): Promise<Pelanggan> {
  const wid = await uid();
  const { data, error } = await supabase.from('pelanggan').update(patch).eq('warung_id', wid).eq('id', id).select('*').single();
  return mapPelanggan(must(data, error));
}

export async function deletePelanggan(id: string): Promise<void> {
  const wid = await uid();
  const { error } = await supabase.from('pelanggan').delete().eq('warung_id', wid).eq('id', id);
  if (error) throw new Error(error.message);
}

// ------------------------------------------------------------- TRANSAKSI
const mapTransaksi = (r: any): Transaksi => ({ ...r, nominal: num(r.nominal) });

interface ListTransaksiOpts {
  pelangganId?: string;
  fromISO?: string; // created_at >= from
  toISO?: string; // created_at < to
  limit?: number;
}

export async function listTransaksi(opts: ListTransaksiOpts = {}): Promise<Transaksi[]> {
  const wid = await uid();
  let q = supabase
    .from('transaksi')
    .select('*, pelanggan(nama, kode)')
    .eq('warung_id', wid)
    .order('created_at', { ascending: false });
  if (opts.pelangganId) q = q.eq('pelanggan_id', opts.pelangganId);
  if (opts.fromISO) q = q.gte('created_at', opts.fromISO);
  if (opts.toISO) q = q.lt('created_at', opts.toISO);
  q = q.limit(opts.limit ?? 5000);
  const { data, error } = await q;
  return must(data, error).map(mapTransaksi);
}

export async function createTransaksi(input: TransaksiInput): Promise<Transaksi> {
  // Trigger cek_batas_kasbon di database akan melempar error kalau melewati batas pelanggan
  const wid = await uid();
  const { data, error } = await supabase.from('transaksi').insert({ ...input, warung_id: wid }).select('*').single();
  return mapTransaksi(must(data, error));
}

export async function deleteTransaksi(id: string): Promise<void> {
  const wid = await uid();
  const { error } = await supabase.from('transaksi').delete().eq('warung_id', wid).eq('id', id);
  if (error) throw new Error(error.message);
}

/** Nomor kwitansi berikutnya, format KWT-0001 (berdasarkan nomor terbesar yang sudah ada) */
export async function nextNoKwitansi(): Promise<string> {
  const wid = await uid();
  const { data, error } = await supabase
    .from('transaksi')
    .select('no_kwitansi')
    .eq('warung_id', wid)
    .eq('jenis', 'cicilan')
    .not('no_kwitansi', 'is', null)
    .order('no_kwitansi', { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  const last = data?.[0]?.no_kwitansi as string | undefined;
  const n = last ? parseInt(last.replace(/\D/g, ''), 10) || 0 : 0;
  return 'KWT-' + String(n + 1).padStart(4, '0');
}
