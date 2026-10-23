# KasbonKu

KasbonKu is a web app for small shop (warung) owners in Indonesia to record
customer credit (*kasbon*) and instalment payments, see who owes how much and who
is overdue, and send polite payment reminders through WhatsApp.
The interface is in Indonesian and works on desktop and phone.

- Live demo: **TODO: add hosted link (e.g. Vercel)**
- Demo account: see [Test accounts](#test-accounts)
- User stories (Indonesian): [docs/user-stories.md](./docs/user-stories.md)

## Problem statement

**Who has the problem.** Owners of small neighbourhood shops who let neighbours and
regular customers buy on credit. A typical owner has 20 to 40 regular credit
customers, uses an Android phone, and is comfortable with WhatsApp but not with
complicated software.

**How they cope today.** They write credit in a paper notebook or on loose notes.
This leads to:

- notebooks that get lost, wet or torn;
- calculation mistakes when adding up debts and payments by hand;
- forgetting who has already paid and how much is left;
- awkward collection, because there is no clean proof and no due-date reminder.

**Why KasbonKu is better.**

- Balances are calculated automatically, so they are always consistent.
- Every transaction is stored permanently and can be searched.
- Overdue customers appear automatically from their due dates.
- A ready-made, polite reminder (with amount and due date) opens in WhatsApp with
  one tap, so collecting is less awkward.
- Credit limits protect the shop: a customer who passes the limit, or has been
  overdue for more than 7 days, cannot take new credit.

## Features

- **Accounts:** register, log in, log out and reset password (Supabase Auth). Each
  account only sees its own data.
- **Dashboard:** outstanding debt, customers to collect from, recent activity.
- **Customer book:** search, filter (all / in debt / overdue / paid), balance,
  profile and full transaction history.
- **Recording transactions:** new credit or payment with items, date, due date and
  payment method, with input validation and business rules.
- **WhatsApp reminders:** polite or formal message templates, sent through `wa.me` links.
- **Financial report:** monthly summary, 7-day cash flow chart, most-bought items,
  summary table, direct PDF download and CSV export.
- **Settings:** shop profile and photo, default credit limit, reminder template,
  password change and data backup (CSV).

## Tech stack

- React 19 and TypeScript, built with Vite 8
- Tailwind CSS (via CDN)
- Supabase (Auth, PostgreSQL, Storage)
- Vitest for automated tests

## Requirements

- Node.js **22.12 or newer** and npm (`node --version`, `npm --version`)
- A free [Supabase](https://supabase.com) project (only needed to run the app locally;
  the hosted demo needs no setup)

## Test accounts

For the hosted demo (and the author's Supabase project):

| Email | Password |
| --- | --- |
| `1@gmail.com` | `123456` |

This is a throw-away demo account that holds sample data only.
If you run the app against **your own** Supabase project, create the same user
yourself: Supabase dashboard, *Authentication*, *Users*, *Add user*, tick
*Auto Confirm User*. Or register in the app (turn off *Confirm email* in
*Authentication, Sign In / Providers, Email* first).

## Run locally (about 10 minutes)

1. Clone the repository and open its folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase values
   (*Project Settings, API*):

   ```dotenv
   VITE_SUPABASE_URL=https://<project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-or-publishable-key>
   ```

   Use the **anon/publishable** key, never the `service_role` key. `.env.local` is
   git-ignored and must never be committed.
4. Create the database. In the Supabase dashboard open *SQL Editor* and run these
   files from the [`database/`](./database/) folder **in this order**:
   1. `kasbonku_schema.sql` (base tables and the `v_saldo_pelanggan` view) **TODO: add this file to the repository**
   2. `kasbonku_isolasi.sql` (Row Level Security, so each account only sees its own data)
   3. `kasbonku_migrasi.sql` (shop creation policy and the profile photo bucket)
5. In Supabase, *Authentication, URL Configuration*, allow `http://localhost:5173` as a redirect URL
   (needed for the password reset email).
6. Start the app and open <http://localhost:5173>:

   ```bash
   npm run dev
   ```

7. Log in with the test account above (after creating it as described in
   [Test accounts](#test-accounts)).

## Run the tests

```bash
npm test
```

The tests run locally in a few seconds and need **no** Supabase connection and no
`.env.local`. They cover the business rules and input validation:

| File | What it checks |
| --- | --- |
| `src/__tests__/validation.test.ts` | email, password, phone, photo and customer validation; transaction rules (credit limit, locked customers, overpayment) |
| `src/__tests__/utils.test.ts` | rupiah formatting, WhatsApp links and message templates, due dates, text helpers |
| `src/__tests__/analytics.test.ts` | running balance, overdue lists, 7-day cash flow, weekly change, top items |
| `src/__tests__/export.test.ts` | CSV export (BOM, quoting of commas/quotes/line breaks, file name) and the blocked print pop-up |
| `src/__tests__/features.test.ts` | credit history analysis, report helpers, credit-limit settings, data-layer error handling |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```text
.
├── database/                 # SQL scripts for Supabase
├── docs/                     # User stories (Indonesian)
├── src/
│   ├── api/                  # All data access and auth calls to Supabase
│   ├── components/           # Components shared across features
│   ├── features/
│   │   ├── auth/             # Login, register, password recovery
│   │   ├── dashboard/        # home, customers, transactions, reports, settings
│   │   └── landing/          # Public landing page
│   ├── lib/                  # Supabase client, types, analytics, utils
│   ├── validation/           # Input validation and transaction rules
│   └── __tests__/            # Automated tests
├── .env.example
├── index.html
└── package.json
```

The code is layered on purpose: screens live in `features/`, every Supabase call
lives in `api/`, and business rules (validation, balances, due dates) live in
`validation/` and `lib/` as pure functions, so they can be tested without a
database or a browser.

## Robustness

- Every form is validated before it is sent (see `src/validation/`): empty or
  malformed email, short passwords, invalid phone numbers, empty or oversized
  amounts, credit above the limit, payments above the remaining debt.
- Errors from the server are caught and shown as readable Indonesian messages
  instead of crashing the screen, with a "try again" action where it makes sense.
- Printed and PDF reports escape user text, so customer input cannot break the document.

## Known limitations

- One shop per account; no multi-user or staff roles.
- Reminders are sent manually through WhatsApp links, not automatically.
- The PDF is generated in the browser as an image, so its text cannot be selected.
- Tailwind is loaded from a CDN, so the app needs an internet connection.

## Project context

This project was developed as a team project, while the retake brief is written
for individual work. This has been disclosed to the lecturer.
**TODO: describe your own contribution here (what you built, in your own words).**

## AI usage

- **Claude (Anthropic):** helped me reorganise the frontend into a feature-based
  folder structure, split large components into smaller ones, rename Indonesian file
  names to English, write the automated tests, make the PDF buttons download directly,
  fix the landing-page anchor staying in the URL, guide the Git and pull-request workflow,
  and draft the user stories and this README.
- **TODO: list any other AI tools used earlier in the project and what for** (for
  example the first version of the code or the SQL scripts). If none were used, delete this line.
- All AI-generated changes were reviewed and run by me before I committed them.

## Credits

React, Vite, TypeScript, Tailwind CSS, Supabase (`@supabase/supabase-js`),
[Lucide](https://lucide.dev) icons, [Vitest](https://vitest.dev) and
[html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (MIT).

## Security notes

- Never commit `.env.local` or any Supabase secret.
- Never use the `service_role` key in the browser app.
- Row Level Security must stay enabled on every table that holds user data.