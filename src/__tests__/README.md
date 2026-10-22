# Automated tests

The test suite checks the business logic of KasbonKu: validation rules, money and
date formatting, WhatsApp messages, debt calculations and error handling.

**It needs no `.env.local`, no internet connection and no Supabase database.**
Everything runs locally in under a second.

## Run the tests (one command)

From the project root:

```bash
npm test
```

Expected result (the order of the files may differ):

```
 ✓ src/__tests__/features.test.ts   (19 tests)
 ✓ src/__tests__/analytics.test.ts  (12 tests)
 ✓ src/__tests__/utils.test.ts      (14 tests)
 ✓ src/__tests__/validation.test.ts (18 tests)

 Test Files  4 passed (4)
      Tests  63 passed (63)
```

The command exits with an error code if any test fails, so it can also be used in CI.

## Requirements

- Node.js 22.12 or newer (required by Vitest 5). Check with `node -v`.
- Dependencies installed once with `npm install`.
- `package.json` must contain the test script and the Vitest dev dependency:

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^5.0.0"
  }
}
```

If `npm test` says `vitest: not found` or `'vitest' is not recognized`, run
`npm install` first. If it says `Missing script: "test"`, add the script above.

## Other useful commands

| Goal | Command |
|------|---------|
| Re-run automatically while you edit code | `npx vitest` |
| Run one file | `npx vitest run src/__tests__/validation.test.ts` |
| Run only tests whose name contains a word | `npx vitest run -t "limit"` |
| Show every test name | `npx vitest run --reporter=verbose` |

## What is tested

| File | Tests | What it verifies |
|------|:-----:|------------------|
| `validation.test.ts` | 18 | Login and password rules, email/phone/required-text checks, customer and shop profile, photo type and size, and the transaction business rules: credit limit, locked customers (overdue more than 7 days), amount above the maximum, a payment larger than the remaining debt. |
| `utils.test.ts` | 14 | Rupiah formatting and dotted number input, WhatsApp number normalisation and `wa.me` links, polite and formal reminder templates, receipts (LUNAS only when no debt remains), due-date calculation, text helpers, HTML escaping. |
| `analytics.test.ts` | 12 | Running balance per customer, totals, overdue and due-today lists, on-time percentage, 7-day cash flow, weekly change in debt, most frequently bought items. |
| `features.test.ts` | 19 | Logic behind the customer detail page and the report: payments applied to the oldest credit first, favourite items, payment pattern and mini chart, report status labels (due date, partial payment, LUNAS), default credit-limit cards, and error handling in the data layer (friendly limit error, "not logged in" guard, number conversion). |

## How the tests are written

- **Fake data builders.** `helpers.ts` provides `mkTrans()` and `mkSaldo()`, which create a
  complete transaction or customer balance. A test only writes the fields that matter.
- **Fake clock.** Rules that depend on "today" (overdue, due today, 7-day chart) freeze time with
  `vi.useFakeTimers()` and `vi.setSystemTime(...)`, so results never change from day to day.
- **No real database.** `features.test.ts` replaces the Supabase client with `vi.mock(...)`.
  Nothing is sent over the network.
- **Time zone independent.** The suite was checked in Asia/Jakarta, UTC, America/New_York and
  Pacific/Auckland. All 63 tests pass in each.

## Add a new test

1. Open the matching `*.test.ts` file, or create a new one ending in `.test.ts` in this folder.
2. Write the case:

```ts
import { describe, it, expect } from 'vitest';
import { formatRupiah } from '../lib/utils';

describe('utils: money formatting', () => {
  it('formats zero', () => {
    expect(formatRupiah(0)).toBe('Rp 0');
  });
});
```

3. Run `npm test`. A good test should fail when you deliberately break the code it covers,
   so try that once.

## Not covered by automated tests

- React screens and components (checked by hand in the browser).
- Real Supabase queries and database security rules (RLS). Account isolation is enforced by
  `kasbonku_isolasi.sql` and by the `warung_id` filter on every query in `src/api/`.
