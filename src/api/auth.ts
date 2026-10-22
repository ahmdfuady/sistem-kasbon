import { supabase } from '../lib/supabase';

// Pembungkus tipis untuk Supabase Auth. Hasilnya sengaja dibiarkan { data, error }
// supaya perilaku halaman login/daftar sama persis seperti sebelumnya.

export const loginDenganSandi = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export interface DataDaftarWarung {
  email: string;
  password: string;
  namaPemilik: string;
  namaWarung: string;
  whatsapp: string;
}

export const daftarAkunWarung = (d: DataDaftarWarung) =>
  supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: {
      // Data metadata wajib persis untuk trigger di database/01_kasbonku_migrasi.sql
      data: {
        nama_pemilik: d.namaPemilik,
        nama_warung: d.namaWarung,
        whatsapp: d.whatsapp,
      },
    },
  });

export const kirimEmailResetSandi = (email: string) =>
  supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });

export const ubahSandi = (password: string) => supabase.auth.updateUser({ password });
