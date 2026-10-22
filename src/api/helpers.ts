import { supabase } from '../lib/supabase';

// Semua fungsi melempar Error(message) kalau gagal, jadi cukup try/catch di komponen.
export const must = <T,>(data: T | null, error: { message: string } | null): T => {
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

export const num = (v: unknown): number => Number(v ?? 0);

/**
 * ID akun (= id warung) yang sedang login. SEMUA query data wajib difilter dengan ID ini,
 * jadi sebuah akun tidak akan pernah melihat data akun lain, walaupun RLS di database salah konfigurasi.
 */
export async function uid(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error('Sesi login berakhir. Silakan masuk lagi.');
  return id;
}
