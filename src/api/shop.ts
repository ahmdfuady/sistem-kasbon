import { supabase } from '../lib/supabase';
import type { Warung } from '../lib/types';
import { must, num } from './helpers';

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
 * kalau baris warung belum ada, buat otomatis (butuh policy insert dari database/01_kasbonku_migrasi.sql).
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
