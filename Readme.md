# KasbonKu

KasbonKu adalah aplikasi web untuk membantu pemilik warung mencatat kasbon dan
cicilan pelanggan, memantau sisa utang serta jatuh tempo, dan melihat ringkasan
keuangan warung. Antarmuka menggunakan Bahasa Indonesia dan dirancang agar
nyaman digunakan di desktop maupun ponsel.

## Fitur

- **Autentikasi akun warung:** daftar, masuk, keluar, dan reset kata sandi melalui
  Supabase Auth.
- **Beranda dashboard:** ringkasan saldo pelanggan, aktivitas terbaru, dan
  pelanggan yang perlu ditagih.
- **Buku pelanggan:** cari pelanggan, lihat saldo, detail profil, dan riwayat
  transaksi.
- **Pencatatan transaksi:** catat kasbon atau cicilan, rincian barang, tanggal,
  jatuh tempo, dan metode pembayaran.
- **Pengingat WhatsApp:** siapkan pesan tagihan melalui tautan WhatsApp.
- **Laporan keuangan:** ringkasan, grafik arus transaksi, barang terbanyak, dan
  tabel rekap; laporan dapat diekspor atau dicetak.
- **Pengaturan warung:** kelola profil warung, foto, aturan kasbon, plafon, dan
  template pengingat.
- **Panduan penggunaan:** akses panduan singkat dari dashboard.

## Teknologi

- React 19 dan TypeScript
- Vite 8
- Tailwind CSS melalui CDN
- Supabase Auth, PostgreSQL, dan Storage
- Vitest untuk pengujian logika dan validasi
- Lucide React untuk ikon

## Persyaratan

- Node.js **22.12 atau lebih baru**
- npm
- Proyek Supabase untuk autentikasi dan penyimpanan data

Periksa versi Node.js dan npm:

```bash
node --version
npm --version
```

## Menjalankan secara lokal

1. Clone repositori dan masuk ke direktori proyek.
2. Pasang dependency:

   ```bash
   npm install
   ```

3. Buat file `.env.local` di direktori utama proyek:

   ```dotenv
   VITE_SUPABASE_URL=https://<project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<supabase-publishable-or-anon-key>
   ```

   Ambil URL dan key dari pengaturan API proyek Supabase. Gunakan **publishable
   key/anon key**, bukan `service_role` key. Variabel dengan awalan `VITE_`
   tersedia pada bundle browser; keamanan akses data harus ditegakkan dengan
   Row Level Security (RLS).

4. Siapkan skema dan aturan keamanan Supabase seperti dijelaskan di bagian
   [Database dan Supabase](#database-dan-supabase).
5. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

6. Buka URL lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Perintah

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan Vite |
| `npm run build` | Memeriksa TypeScript dan membuat build produksi di `dist/` |
| `npm run preview` | Menjalankan pratinjau build produksi |
| `npm test` | Menjalankan pengujian sekali |
| `npm run test:watch` | Menjalankan pengujian dalam mode watch |

## Database dan Supabase

Aplikasi membutuhkan tabel `warung`, `pelanggan`, dan `transaksi`, serta view
`v_saldo_pelanggan`. Data warung dan transaksi dipisahkan per akun, dan
pengambilan data aplikasi mengandalkan autentikasi serta kebijakan RLS.

Folder [`database/`](./database/) berisi skrip SQL pendukung:

- [`kasbonku_isolasi.sql`](./database/kasbonku_isolasi.sql) mengaktifkan RLS,
  membuat ulang kebijakan akses berdasarkan akun, dan membuat ulang view saldo
  dengan `security_invoker`.
- [`kasbonku_migrasi.sql`](./database/kasbonku_migrasi.sql) menyediakan
  kebijakan pembuatan data warung untuk akun sendiri dan bucket Storage beserta
  kebijakan akses foto profil.

**Catatan untuk instalasi baru:** kedua skrip tersebut adalah skrip tambahan,
bukan skema dasar. `kasbonku_migrasi.sql` menyebutkan bahwa skema dasar
`kasbonku_schema.sql` harus tersedia lebih dahulu, tetapi file skema dasar itu
tidak ada di repositori ini. Siapkan skema dasar yang sesuai sebelum
menjalankan skrip pendukung. Setelah tabel dasarnya tersedia, jalankan
`kasbonku_isolasi.sql`, lalu `kasbonku_migrasi.sql`, melalui Supabase SQL Editor.
Periksa hasil setiap skrip sebelum aplikasi digunakan.

Konfigurasi URL redirect untuk reset kata sandi juga perlu disesuaikan di
Supabase Auth agar mengizinkan origin aplikasi (misalnya URL localhost saat
pengembangan dan domain deployment saat produksi).

## Struktur proyek

```text
.
├── database/                   # Skrip SQL pendukung Supabase
├── src/
│   ├── api/                    # Akses data dan autentikasi Supabase
│   ├── components/             # Komponen bersama
│   ├── features/
│   │   ├── auth/               # Login, pendaftaran, dan pemulihan sandi
│   │   ├── dashboard/          # Beranda, pelanggan, transaksi, laporan, pengaturan
│   │   └── landing/            # Halaman publik
│   ├── lib/                    # Klien Supabase, tipe, analitik, dan utilitas
│   ├── styles/                 # Gaya global
│   ├── validation/             # Validasi input dan aturan transaksi
│   └── __tests__/              # Pengujian unit
├── index.html
├── package.json
└── Readme.md
```

## Pengujian

Jalankan seluruh pengujian dengan:

```bash
npm test
```

Pengujian berfokus pada aturan bisnis, termasuk validasi input, kalkulasi saldo,
jatuh tempo, format uang dan tanggal, pesan WhatsApp, laporan, serta penanganan
error di lapisan data. Pengujian berjalan lokal dan tidak memerlukan koneksi
Supabase atau file `.env.local`.

## Keamanan dan konfigurasi

- Jangan menambahkan `.env.local` atau secret Supabase ke repositori.
- Jangan pernah menggunakan `service_role` key di aplikasi browser.
- Aktifkan dan periksa RLS pada seluruh tabel yang menyimpan data pengguna.
- Pastikan kebijakan RLS membatasi akses ke data milik akun yang sedang masuk.
- Untuk deployment, atur variabel `VITE_SUPABASE_URL` dan
  `VITE_SUPABASE_ANON_KEY` pada environment build.
