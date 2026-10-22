import { supabase } from '../lib/supabase';
import type { Transaksi, TransaksiInput } from '../lib/types';
import { must, num, uid } from './helpers';

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
