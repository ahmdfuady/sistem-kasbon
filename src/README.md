# Struktur `src/` KasbonKu

```
src/
├── main.tsx, App.tsx          pintu masuk & penentu halaman (landing/login/dashboard)
├── styles/index.css           gaya global (Tailwind)
├── api/                       semua komunikasi ke Supabase (auth, warung, pelanggan, transaksi)
├── lib/                       hal umum: supabase client, types, analytics, utils/ (rupiah, tanggal, whatsapp, cetak, csv)
├── validation/                aturan validasi input
├── components/                komponen yang dipakai banyak fitur (AddCustomerModal)
└── features/
    ├── landing/               halaman depan (LandingPage + sections/)
    ├── auth/                  AuthContext, AuthLayout, Login, Register, ForgotPassword, ResetPassword
    └── dashboard/             Dashboard (kerangka) + components/ + beranda/ + pelanggan/ + transaksi/ + laporan/ + pengaturan/
```

Aturan mudahnya: **fitur dicari di `features/`, urusan data di `api/`, fungsi bantu di `lib/utils/`.**
