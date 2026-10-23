# `src/` structure

```
src/
├── main.tsx, App.tsx          entry point and top-level routing (landing / auth / dashboard)
├── styles/index.css           global styles (Tailwind)
├── api/                       all communication with Supabase (auth, shop, customers, transactions)
├── lib/                       shared code: supabase client, types, analytics, utils/ (currency, date, text, whatsapp, print, csv)
├── validation/                input validation rules
├── components/                components shared by several features (AddCustomerModal)
└── features/
    ├── landing/               public landing page (LandingPage + sections/)
    ├── auth/                  AuthContext, AuthLayout, Login, Register, ForgotPassword, ResetPassword
    └── dashboard/             Dashboard (shell) + components/ + home/ + customers/ + transactions/ + reports/ + settings/
```

Rule of thumb: **features live in `features/`, data access in `api/`, helper functions in `lib/utils/`.**
