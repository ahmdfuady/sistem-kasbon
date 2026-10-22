/**
 * Hasil semua fungsi validasi:
 *   null   -> input valid
 *   string -> pesan error yang siap ditampilkan ke pengguna
 *
 * Contoh pemakaian di komponen:
 *   const err = validasiPelanggan({ nama, whatsapp, batasKasbon });
 *   if (err) return setError(err);
 */
export type CekHasil = string | null;
