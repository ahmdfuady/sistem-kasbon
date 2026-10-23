import { supabase } from '../lib/supabase';
import type { Pelanggan, PelangganInput, SaldoPelanggan } from '../lib/types';
import { must, num, uid } from './helpers';

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

