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

(Ditulis dalam bahasa Inggris agar konsisten dengan repo dan README.)

| ID | User story | Acceptance criteria |
| --- | --- | --- |
| US-1 | As a shop owner, I can log in so that my records are private. | Valid credentials open the dashboard. Wrong password shows an error message. Any other page redirects to login when not authenticated. |
| US-2 | As a shop owner, I can add a customer so that I can track their debt. | Name is required. Duplicate names are rejected. Phone, if given, contains digits only (08.. or +62..). |
| US-3 | As a shop owner, I can record a new debt so that the balance is updated. | Amount must be an integer greater than 0. Date defaults to today and cannot be empty. Optional due date cannot be before the debt date. Customer balance increases by the amount. |
| US-4 | As a shop owner, I can record a payment so that the remaining debt decreases. | Amount must be greater than 0. Amount cannot exceed the remaining balance. Balance decreases by the amount. Fully paid customer shows status "Lunas". |
| US-5 | As a shop owner, I can view a customer's balance and history so that I know exactly what they owe. | History is sorted by date, newest first. Balance = total debts - total payments. Each entry shows type, amount, date, and note. |
| US-6 | As a shop owner, I can see a list of overdue customers so that I know who to remind. | Customers with balance > 0 and due date earlier than today appear in "Telat". Fully paid customers never appear. The list shows days overdue. |
| US-7 | As a shop owner, I can generate a WhatsApp reminder so that I can collect politely. | Message text contains customer name, remaining balance (formatted Rp), and due date. A `wa.me` link opens with the message prefilled. Customers without a phone number show a clear message instead of a broken link. |
| US-8 | As a shop owner, I can search customers and archive fully paid ones so that my list stays tidy. | Search is case-insensitive and matches partial names. Customers with balance > 0 cannot be archived or deleted. Archived customers are hidden from the default list. |

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

## 8. Arsitektur dan Tech Stack (Usulan)

Stack final bebas dipilih sesuai kemampuan. Usulan: **Python + FastAPI (atau Flask) + SQLite + pytest**, template HTML sederhana.

```
kasbonku/
  app/
    routes/         # tipis: terima request, panggil service
    services/       # aturan bisnis: hitung_saldo, catat_pembayaran
    repositories/   # akses database
    models/         # Pelanggan, Transaksi
    validators/     # validasi input
    templates/
  tests/
  Dockerfile
  docker-compose.yml
  .env.example
  .gitignore
  README.md
```

**Prinsip desain:** aturan bisnis hanya di `services/` supaya bisa dites tanpa web dan tidak diduplikasi di route.

## 9. Model Data (Ringkas)

**customers**

- id, name (unik), phone (opsional), is\_archived, created\_at

**transactions**

- id, customer\_id, type (`DEBT` atau `PAYMENT`), amount (integer rupiah), date, due\_date (opsional, untuk DEBT), note, created\_at

**users**

- id, username, password\_hash

Saldo pelanggan = jumlah semua `DEBT` dikurangi jumlah semua `PAYMENT`.

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
