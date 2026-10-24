# PRD: KasbonKu, Pencatat Utang-Piutang Warung

IK102 Retake Take-Home Project | Versi 1.0 | 16 Oktober 2026 | Deadline: 23 Oktober 2026, 23:59 WIB

## 1. Ringkasan

KasbonKu adalah web sederhana untuk pemilik warung kelontong agar bisa mencatat utang (kasbon) pelanggan, mencatat cicilan, memantau siapa yang sudah jatuh tempo, dan mengirim pengingat tagihan lewat WhatsApp. Website ini menggantikan buku tulis kasbon yang mudah hilang, rusak, dan salah hitung.

Fokus proyek: **satu fitur inti (manajemen kasbon), kecil, selesai dengan baik**, sesuai syarat soal.

## 2. Latar Belakang dan Problem Statement

**Siapa yang punya masalah.** Pemilik warung kelontong skala kecil yang memberi kasbon kepada tetangga dan pelanggan tetap.

**Cara mengatasi sekarang.** Mencatat di buku tulis atau nota kertas. Akibatnya:

- Buku hilang, basah, atau halaman sobek.
- Salah hitung saat menjumlahkan utang dan cicilan manual.
- Lupa siapa yang sudah mencicil dan berapa sisanya.
- Sulit dan canggung menagih karena tidak ada bukti rapi.
- Tidak ada pengingat jatuh tempo.

**Kenapa KasbonKu lebih baik.**

- Saldo dihitung otomatis dan selalu konsisten.
- Riwayat transaksi tersimpan permanen dan bisa dicari.
- Daftar "Telat" muncul otomatis berdasarkan jatuh tempo.
- Ringkasan tagihan siap dikirim lewat WhatsApp, sopan dan berisi rincian.

**Validasi masalah (TODO).** Wawancarai minimal 1 pemilik warung nyata (tetangga atau keluarga), lalu kutip 2-3 kalimat hasil wawancara di bagian ini. Ini menguatkan nilai "Problem and solution fit".

> Catatan wawancara: *(isi nama/inisial narasumber, tanggal, dan kutipan di sini)*

## 3. Tujuan dan Non-Tujuan

**Tujuan**

- Pemilik warung bisa mencatat utang dan cicilan dalam kurang dari 30 detik per transaksi.
- Saldo per pelanggan selalu akurat (tidak ada kesalahan pembulatan).
- Pemilik bisa melihat dalam satu layar siapa saja yang telat bayar.
- Aplikasi bisa dijalankan orang asing dalam 15 menit lewat README.

**Non-tujuan (sengaja tidak dikerjakan)**

- Multi-pengguna atau multi-toko.
- Pembayaran online atau integrasi bank/e-wallet.
- Notifikasi otomatis (WhatsApp hanya lewat tautan `wa.me`, dikirim manual).
- Grafik/laporan keuangan lengkap, manajemen stok, atau kasir.
- Aplikasi mobile native (cukup web yang responsif di HP).

## 4. Pengguna Target

**Persona: Bu Siti, 48 tahun, pemilik warung kelontong.**

- Punya 20-40 pelanggan yang sering berutang.
- Memakai HP Android, terbiasa dengan WhatsApp, kurang nyaman dengan aplikasi rumit.
- Kebutuhan: cepat mencatat, mudah melihat siapa berutang berapa, tidak canggung saat menagih.

## 5. User Stories dan Acceptance Criteria

| ID | User story | Acceptance criteria |
| --- | --- | --- |
| US-1 | Sebagai pemilik warung, saya dapat login agar catatan saya tetap pribadi. | Kredensial yang benar membuka dashboard. Password salah menampilkan pesan error. Halaman lain mengarahkan ke halaman login jika belum login. |
| US-2 | Sebagai pemilik warung, saya dapat menambah pelanggan agar saya bisa mencatat utangnya. | Nama wajib diisi. Nama yang sama ditolak. Nomor telepon, jika diisi, hanya berisi angka (08.. atau +62..). |
| US-3 | Sebagai pemilik warung, saya dapat mencatat utang baru agar saldo pelanggan bertambah. | Nominal harus bilangan bulat lebih dari 0. Tanggal otomatis hari ini dan tidak boleh kosong. Jatuh tempo (opsional) tidak boleh sebelum tanggal utang. Saldo pelanggan bertambah sebesar nominal. |
| US-4 | Sebagai pemilik warung, saya dapat mencatat pembayaran agar sisa utang berkurang. | Nominal harus lebih dari 0. Nominal tidak boleh melebihi sisa utang. Saldo berkurang sebesar nominal. Pelanggan yang sudah membayar penuh berstatus "Lunas". |
| US-5 | Sebagai pemilik warung, saya dapat melihat saldo dan riwayat pelanggan agar tahu persis berapa yang ia utang. | Riwayat diurutkan dari tanggal terbaru. Saldo = total utang - total pembayaran. Setiap catatan menampilkan jenis, nominal, tanggal, dan catatan. |
| US-6 | Sebagai pemilik warung, saya dapat melihat daftar pelanggan yang telat agar tahu siapa yang perlu diingatkan. | Pelanggan dengan saldo > 0 dan jatuh tempo sebelum hari ini muncul di daftar "Telat". Pelanggan yang sudah lunas tidak pernah muncul. Daftar menampilkan jumlah hari telat. |
| US-7 | Sebagai pemilik warung, saya dapat membuat pengingat WhatsApp agar bisa menagih dengan sopan. | Teks pesan berisi nama pelanggan, sisa utang (format Rp), dan tanggal jatuh tempo. Tautan `wa.me` terbuka dengan pesan yang sudah terisi. Pelanggan tanpa nomor telepon menampilkan pesan yang jelas, bukan tautan rusak. |
| US-8 | Sebagai pemilik warung, saya dapat mencari pelanggan dan mengarsipkan yang sudah lunas agar daftar tetap rapi. | Pencarian tidak membedakan huruf besar/kecil dan cocok dengan sebagian nama. Pelanggan dengan saldo > 0 tidak bisa diarsipkan atau dihapus. Pelanggan yang diarsipkan tidak tampil di daftar utama. |

## 6. Kebutuhan Fungsional

- **FR-1 Autentikasi:** login/logout dengan password ter-hash. Satu akun pemilik (seed).
- **FR-2 Pelanggan:** tambah, ubah, cari, arsipkan.
- **FR-3 Transaksi:** catat utang dan pembayaran; transaksi tidak diedit, hanya bisa dikoreksi dengan transaksi baru (menjaga riwayat tetap jujur).
- **FR-4 Saldo:** dihitung dari seluruh transaksi di satu tempat (service layer).
- **FR-5 Jatuh tempo:** daftar "Telat" otomatis.
- **FR-6 Pengingat WhatsApp:** generator teks dan tautan `wa.me`.
- **FR-7 Validasi:** semua input divalidasi di server dengan pesan error yang ramah.

## 7. Kebutuhan Non-Fungsional

- **Uang:** disimpan sebagai integer rupiah, tidak memakai float.
- **Keamanan:** password di-hash (bcrypt/argon2), secret di `.env`, `.env` masuk `.gitignore`, tidak ada kunci di repo.
- **Robustness:** input tidak valid tidak membuat aplikasi crash; tampil pesan error yang jelas.
- **Responsif:** nyaman dipakai di layar HP.
- **Portabilitas:** dapat dijalankan dengan `docker compose up` atau maksimal 4 perintah.
- **Bahasa UI:** Bahasa Indonesia.

## 8. Arsitektur dan Tech Stack

KasbonKu dibangun sebagai aplikasi web satu halaman (SPA) yang berbicara langsung ke layanan backend terkelola.

**Tech stack:**

- **Frontend:** React + TypeScript, dibangun dengan Vite.
- **Styling:** Tailwind CSS (responsif untuk layar HP).
- **Backend dan database:** Supabase (PostgreSQL, Auth, dan Storage untuk foto warung).
- **Pengujian:** Vitest, dijalankan dengan satu perintah `npm test`.
- **Deploy:** Vercel (frontend) dan Supabase (database).

**Struktur folder (`src/`):**

```
src/
  main.tsx, App.tsx     # titik masuk dan routing (landing / auth / dashboard)
  features/             # tampilan per fitur (UI)
    landing/            # halaman publik
    auth/               # login, daftar, lupa dan reset sandi
    dashboard/          # beranda, pelanggan, transaksi, laporan, pengaturan
  components/           # komponen yang dipakai bersama (AddCustomerModal)
  api/                  # satu-satunya lapisan yang bicara ke Supabase
  validation/           # aturan validasi input dan aturan bisnis transaksi
  lib/                  # logika murni: analytics, types, supabase client
    utils/              # currency, date, text, whatsapp, print, csv
  styles/               # CSS global
  __tests__/            # tes otomatis
database/
  kasbonku_migrasi.sql  # skema tabel, view saldo, trigger
  kasbonku_isolasi.sql  # RLS agar data tiap warung terpisah
```

**Alur data:** `features/` (tampilan) memanggil `validation/` dan `lib/` untuk aturan dan perhitungan, lalu `api/` untuk membaca dan menulis data ke Supabase.

**Prinsip desain:**

- Aturan bisnis (batas kasbon, kasbon terkunci, pembayaran melebihi sisa, pesan WhatsApp, daftar telat) berada di `validation/` dan `lib/` sebagai fungsi murni, sehingga bisa dites tanpa tampilan dan tanpa database.
- Seluruh akses data dipusatkan di `api/`, dan setiap query difilter dengan `warung_id`.
- Saldo dihitung di satu tempat, yaitu view database `v_saldo_pelanggan`, sehingga angkanya konsisten di semua layar.
- Keamanan data: password di-hash oleh Supabase Auth, isolasi antar akun dijaga oleh Row Level Security, dan kunci hanya disimpan di `.env.local` (tidak masuk repo).

## 9. Model Data (Ringkas)

**warung** (akun pemilik, terhubung ke Supabase Auth)

- id, nama_pemilik, nama_warung, whatsapp, alamat, foto_url, catatan_struk, plafon_default, kunci_kasbon, template_wa (`santun` atau `formal`), created_at

**pelanggan**

- id, warung_id, kode, nama, whatsapp (opsional), alamat, catatan_pribadi, batas_kasbon (opsional), created_at

**transaksi**

- id, warung_id, pelanggan_id, jenis (`kasbon` atau `cicilan`), nominal (rupiah), barang, catatan, tempo_option, jatuh_tempo (opsional, untuk kasbon), metode_bayar, no_kwitansi (untuk cicilan, format `KWT-0001`), created_at

**v_saldo_pelanggan** (view, dihitung otomatis)

- pelanggan_id, total_kasbon, total_bayar, sisa_utang, jatuh_tempo_terakhir, hari_telat

Sisa utang pelanggan = jumlah semua `kasbon` dikurangi jumlah semua `cicilan`. Trigger `cek_batas_kasbon` di database menolak kasbon yang melewati batas pelanggan.

## 10. Strategi Pengujian

Target 8 tes otomatis (syarat minimal 5), dijalankan dengan satu perintah `pytest`.

| # | Tes | Memverifikasi |
| --- | --- | --- |
| T1 | Saldo = total utang - total bayar | US-5 |
| T2 | Pembayaran melebihi sisa utang ditolak | US-4 |
| T3 | Nominal nol/negatif ditolak | US-3, US-4 |
| T4 | Nama kosong atau duplikat ditolak | US-2 |
| T5 | Pelanggan lewat jatuh tempo masuk "Telat" | US-6 |
| T6 | Pelanggan lunas tidak masuk "Telat" | US-6 |
| T7 | Format pesan WhatsApp benar | US-7 |
| T8 | Akses tanpa login ditolak | US-1 |

**Kasus robustness manual:** nominal berisi huruf, angka sangat besar, tanggal tidak valid, ID pelanggan tidak ada.

## 11. Strategi Version Control

- Minimal 15 commit tersebar, target 20+ dengan ritme 3 commit per hari mulai 16 Oktober.
- Satu fitur atau perbaikan kecil per commit, dengan pesan bermakna, misalnya `feat: reject payments above remaining balance`.
- Format: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`.
- Tag commit akhir `final-submission`.

## 12. Deliverables dan Pemetaan ke Rubrik

| Deliverable | Rubrik (bobot) | Status |
| --- | --- | --- |
| Problem statement (README/PDF) | Problem and solution fit (15) | Belum |
| 8 user stories + acceptance criteria | Requirements (15) | Draft di dokumen ini |
| Source code berlapis, tanpa secret | Code structure (25) | Belum |
| 15+ commit bermakna | Version control (10) | Belum |
| 8 tes + validasi input | Testing and robustness (15) | Belum |
| README English (run, test, akun tes, AI usage) | Documentation (10) | Belum |
| Video 4-5 menit | Explanation video (10) | Belum |

## 13. Rencana Kerja (16-23 Oktober 2026)

| Tanggal | Target |
| --- | --- |
| Jum 16 Okt | Finalisasi PRD, buat repo, pilih stack, wawancara 1 pemilik warung |
| Sab 17 Okt | Struktur proyek, model data, login (US-1) |
| Min 18 Okt | CRUD pelanggan, catat utang (US-2, US-3) |
| Sen 19 Okt | Pembayaran, saldo, validasi (US-4, US-5) |
| Sel 20 Okt | Jatuh tempo, WhatsApp, arsip/pencarian (US-6, US-7, US-8) |
| Rab 21 Okt | Tes lengkap, Docker/hosting, README |
| Kam 22 Okt | Rekam video, cek semua syarat, tag `final-submission` |
| Jum 23 Okt | Buffer, submit sebelum 23:59 WIB |

## 14. Rencana Video (4-5 Menit)

- **0:00-1:30 Demo:** tambah pelanggan, catat utang, cicilan, daftar telat, kirim WhatsApp.
- **1:30-2:30 Struktur kode:** kenapa dipisah route/service/repository.
- **2:30-3:30 Satu bug:** contoh, hasil hitung tidak akurat karena `float`, diperbaiki dengan integer rupiah. Catat bug asli yang kamu temui selama mengerjakan.
- **3:30-4:30 Satu trade-off:** contoh, SQLite dipilih dibanding PostgreSQL karena satu pengguna dan setup mudah, dengan konsekuensi sulit di-scale.
- **4:30-5:00 Penutup.**

## 15. Risiko dan Mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Waktu tinggal 7 hari | Scope dikunci, tanpa fitur tambahan; kerjakan sesuai urutan user story |
| Commit menumpuk di akhir | Commit tiap fitur kecil mulai hari ini |
| Tidak bisa menjelaskan kode di video | Tulis sendiri bagian inti, pelajari semua kode hasil bantuan AI |
| README gagal dijalankan orang lain | Uji dengan satu teman dari nol dalam 15 menit |
| Secret ikut ter-commit | `.gitignore` dibuat di commit pertama, sediakan `.env.example` |

## 16. Kebijakan Penggunaan AI

AI diperbolehkan. Semua penggunaan dicatat di README bagian "AI usage" (tool apa dan untuk apa). Setiap bagian yang tidak bisa dijelaskan di video dianggap bukan milik sendiri, jadi pahami semua kode sebelum dikumpulkan.

**Penggunaan AI dalam proyek ini:**

- **Tool:** Claude (Anthropic).
- **Bantuan coding:** menulis dan merapikan kode, mencari penyebab bug, menyusun struktur folder, dan membuat contoh tes.
- **Brainstorming:** menggali ide fitur, merapikan alur aplikasi, dan menyusun PRD serta dokumentasi.
- **Tanggung jawab:** semua keluaran AI saya baca, uji, dan pahami sebelum dipakai, sehingga bisa saya jelaskan sendiri di video.

## 17. Definition of Done

- [ ] 8 user stories dengan acceptance criteria dan sesuai fitur aplikasi
- [ ] Aplikasi berjalan tanpa bantuan (Docker/installer/hosted link)
- [ ] Minimal 5 tes (target 8) lolos dengan satu perintah
- [ ] Validasi input dan penanganan error berfungsi
- [ ] Minimal 15 commit bermakna, tag `final-submission` terpasang
- [ ] Tidak ada password atau kunci di repo
- [ ] README English lengkap (run, test, akun tes, AI usage, kredit library)
- [ ] Problem statement 0,5-1 halaman
- [ ] Video 4-5 menit dengan wajah dan suara sendiri, mencakup 3 prompt
- [ ] Semua dikumpulkan lewat LMS sebelum 23 Oktober 2026, 23:59 WIB