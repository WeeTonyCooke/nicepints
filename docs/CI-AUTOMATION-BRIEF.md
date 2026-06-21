# CI Automation Brief — Layered Automated Testing

**Purpose:** Close the gap between "CI passes" and "the manual smoke test would pass." The mocked Playwright suite (~43 tests) cannot catch real-data bugs — migration drift, broken RLS, auth/session issues, storage uploads, or spec/doc drift (e.g. D-02 default recency).

**Approach:** Each QA-TEST-PLAN item gets assigned to **whichever layer actually exercises its failure mode** — a backend data bug needs a backend test; a UI wiring bug needs a browser. Defaulting everything to full browser automation means some things get tested redundantly while underlying logic bugs stay unverified.

Cost and speed are a useful side-effect of getting this right — not the goal. A few Layer-3 tests are kept even when a cheaper layer *could* run alongside them, because the browser layer is the only one proving the screens are wired to the backend correctly.

Keep the existing mocked `smoke` job as-is — it's fast and useful for every push. The layers below run the things mocks can't validate.

---

## Status (2026-06-17)

| Item | Status | Notes |
|---|---|---|
| **`e2e-live` CI job** | ✅ Shipped | Branch `cursor/live-supabase-e2e-ci` — parallel with `smoke`, does **not** block deploy |
| **Base schema migration** | ✅ Shipped | `20250616000000_base_schema.sql` — `pubs`, `pints`, RLS, `pint-photos` bucket, Rosato's seed |
| **Live Playwright suite** | ✅ Shipped | `e2e/live/` — 8 tests across 3 spec files |
| **`api-live` job (Layer 2)** | ⏳ Planned | Not yet implemented — see §1b |
| **Unit tests (Layer 1)** | ⏳ Planned | Dublln parser, D-02 constant — blocked on inputs/decisions |
| **Deploy gate on `e2e-live`** | ⏳ Optional | Deliberately off until suite is stable in CI |

**Pragmatic first pass:** Phase 1 ships **Layer 3 only** (`e2e-live`). Auth backend contract (A-02/A-03), post/delete data correctness (P-07/R-03), and migration drift are currently exercised **through Playwright + admin helpers**, not a separate `api-live` job. That is intentional for speed of delivery; Layer 2 splits are the next increment (see §1b).

---

### The three layers

| Layer | What it does | What it proves | Catches |
|---|---|---|---|
| **1. Unit tests** | Pure functions, no browser, no network, no database | Logic is correct in isolation | Parser/formatter/calculation bugs |
| **2. API/integration tests** | Calls Supabase directly, no browser | Backend behaves correctly given real inputs | Bad data, broken RLS, wrong writes |
| **3. Playwright (browser) tests** | Real browser, real DOM, real clicks against real Supabase | Screens trigger the backend correctly | UI wiring bugs |

**The rule:** each QA item gets the layer that can detect *its specific* failure mode. Where a bug could only show up in UI wiring, it gets Playwright. Where it's purely backend correctness, an API test catches it without a browser.

---

## 0. Layer assignment — target state vs Phase 1

| QA-TEST-PLAN item | Failure mode | Target layer | Phase 1 (shipped) |
|---|---|---|---|
| A-02 Magic link | Auth backend issues a valid session | 2 — API | **3** — `L-A02` in `e2e/live/auth.spec.ts` (admin `generateLink` + browser redirect) |
| A-03 OTP code | Same | 2 — API | **3** — `L-A03` (UI send code + Inbucket OTP fetch + verify) |
| P-07 Post (data) | Row written with correct fields | 2 — API | **3** — implied by `L-P07` / `L-SMOKE` (real insert + feed assertion) |
| P-07 Post (UI wiring) | "Post" click → write + redirect | 3 — Playwright | ✅ `L-P07`, `L-SMOKE` |
| R-03 Delete (data) | Row removed, ownership respected | 2 — API | **3** — implied by `L-R03` / `L-SMOKE` |
| R-03 Delete (UI wiring) | Edit → bin → confirm path | 3 — Playwright | ✅ `L-R03`, `L-SMOKE` |
| Full smoke (sign in → log → Find → delete) | End-to-end user journey | 3 — Playwright | ✅ `L-SMOKE` |
| Migration drift | All migrations apply on fresh DB | 2 — setup + API | ✅ `supabase db reset --local` in CI + `L-S01`–`L-S03` |
| Reverse-geocode "Dublln" | Parser handles malformed payload | 1 — Unit | ⏳ Blocked — need raw response fixture |
| D-02 default recency | UI default matches documented spec | 3 — Playwright | ⏳ Blocked — need Anthony decision (30 days vs All Time) |

---

## 1. CI job: `e2e-live` (Layer 3 — shipped)

Runs in `.github/workflows/ci.yml`, parallel with `smoke`, `needs: quality`, **30-minute timeout**. Deploy still `needs: smoke` only.

**Setup (every run):**

1. `supabase start`
2. `supabase db reset --local` — applies all migrations fresh (catches drift)
3. Export env via `source <(supabase status -o env)` → `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. `npm run test:e2e:live` — builds preview on `:4173`, runs `e2e/live/**`

**Why `db reset` matters most:** would have caught pending `20250624100000_expand_ie_product_catalog.sql` drift automatically.

**Security:** `SUPABASE_SERVICE_ROLE_KEY` exists **only** in the `e2e-live` job env — not in `smoke` or `quality`.

**Local run (requires Docker):**

```bash
supabase start
supabase db reset --local
set -a && source <(supabase status -o env) && set +a
export VITE_SUPABASE_URL=$API_URL
export VITE_SUPABASE_ANON_KEY=$ANON_KEY
export SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
npm run test:e2e:live
```

### Shipped test inventory (`e2e/live/`)

| Test ID | File | What it proves |
|---|---|---|
| `L-S01` | `migration-smoke.spec.ts` | Add Pint loads 13 active products from real Supabase |
| `L-S02` | `migration-smoke.spec.ts` | Empty DB → feed empty state |
| `L-S03` | `migration-smoke.spec.ts` | REST `/products?active=eq.true` returns 13 rows (RLS) |
| `L-A02` | `auth.spec.ts` | Magic link via admin API → signed-in profile |
| `L-A03` | `auth.spec.ts` | OTP via UI + Inbucket (`:54324`) → signed in |
| `L-P07` | `post-and-delete.spec.ts` | Signed-in post → pint on feed |
| `L-R03` | `post-and-delete.spec.ts` | Edit → delete → gone from feed/profile |
| `L-SMOKE` | `post-and-delete.spec.ts` | Sign in → post → Find (All pints) → delete |

**Google Places:** still mocked in live UI tests where pub search is needed — live suite uses seeded **Rosato's** via local pub search, not the Places API (see §7).

---

## 1b. Planned CI job: `api-live` (Layer 2 — not yet shipped)

Next increment: backend-only tests against the same disposable Supabase instance, **no browser**. Splits data-correctness checks out of Playwright so failures are faster to diagnose and RLS can be tested precisely (e.g. user A vs user B delete).

Suggested job shape:

```yaml
  api-live:
    name: API tests (real Supabase, no browser)
    runs-on: ubuntu-latest
    needs: quality
    steps:
      # same supabase start + db reset + env export as e2e-live
      - run: npm run test:api:live
```

Suggested tests (Vitest — repo has no unit runner yet; introduce once):

```
api-tests/
  auth.test.ts        # A-02/A-03 backend contract (admin createUser + generateLink)
  post-pint.test.ts   # P-07 insert shape (product_id, serving_type, user_id)
  delete-pint.test.ts # R-03 ownership + RLS (user A cannot delete user B's pint)
```

**Highest-value first test:** delete ownership / cross-user RLS — starts closing QA-04 incrementally.

**Action items:**
- [ ] Add Vitest (or confirm existing runner if one appears)
- [ ] Add `test:api:live` script + `api-live` CI job
- [ ] Move auth backend assertions out of Playwright where redundant; keep Playwright for UI wiring only

---

## 2. Auth helpers (shipped)

`e2e/helpers/live-auth.ts`:

- `createConfirmedTestUser()` — admin `createUser` with `email_confirm: true`
- `signInViaMagicLink(page)` — admin `generateLink` + `page.goto(action_link)` with `redirectTo: http://127.0.0.1:4173/profile`
- `fetchLatestOtpFromInbucket(email)` — polls Inbucket at `:54324` for 6-digit OTP (A-03)

Mocked counterpart: `mockSignedIn()` in `e2e/helpers.ts` — live helpers are separate, not drop-in swaps, by design.

`supabase/config.toml` sets `site_url = http://127.0.0.1:4173` and redirect allow-list for preview.

---

## 3. Base schema migration (shipped — prerequisite for local CI)

Production had `pubs`/`pints` before migrations were tracked in-repo. CI `db reset` failed without a foundation migration.

**`supabase/migrations/20250616000000_base_schema.sql`** creates:

- `pubs`, `pints` tables + indexes
- RLS: public read, authenticated insert on `pints`
- Seed pub: **Rosato's**, Moville (used by live post tests)
- Storage bucket **`pint-photos`** + public read / authenticated upload policies

**Production:** migration is idempotent (`IF NOT EXISTS`, `ON CONFLICT`). Apply via SQL Editor or `db push` when ready.

---

## 4. Photo fixture (shipped)

```
e2e/fixtures/test-pint.jpg
```

Live post tests use in-browser canvas upload via `e2e/helpers/live-flow.ts` (same pattern as mocked `add-pint.spec.ts`). Fixture file is committed for future crop/EXIF tests; not required for current live suite.

---

## 5. File layout (shipped)

```
e2e/
  helpers.ts                 (mocked — mockSignedIn, mockSupabase*, etc.)
  helpers/
    live-auth.ts             (admin auth + Inbucket OTP)
    live-flow.ts             (uploadPintPhoto, postSignedInPint, selectPubFromSearch)
  fixtures/
    test-pint.jpg
  *.spec.ts                  (mocked suite — testIgnore: e2e/live/**)
  live/
    migration-smoke.spec.ts  (L-S01–S03)
    auth.spec.ts             (L-A02, L-A03)
    post-and-delete.spec.ts  (L-P07, L-R03, L-SMOKE)

playwright.config.ts         → ignores **/live/**
playwright.live.config.ts    → testDir: ./e2e/live, preview :4173

supabase/
  config.toml                (local CLI — first introduction to repo)
  migrations/
    20250616000000_base_schema.sql   ← new
    20250617000000_*.sql …           ← existing chain

api-tests/                   ← planned (§1b)
```

**Decisions made:**
- ✅ Folder split (`e2e/live/`) over `@live` tag
- ✅ Supabase CLI via CI action (`supabase/setup-cli@v1`), not npm devDependency
- ✅ `scripts/verify-migrations.sh` unchanged — counts non-empty files only; no overlap with `db reset`

---

## 6. Regression tests still open

### 6a. Reverse-geocode "Dublln" (Layer 1 — blocked)

Live QA surfaced corrupted prefill "Dublln" instead of "Dublin". Test as a **unit test with a captured fixture**, not live geocoding in CI.

**Blocked on:** Anthony capturing the raw network response (DevTools → geocoding call → copy body).

**Also blocked on:** locating the actual parser function in codebase (`parseReverseGeocodeResult` or equivalent — not yet identified).

### 6b. D-02 default recency filter (Layer 3 — blocked)

QA-TEST-PLAN says default is Guinness 0.0 + draught + **last 30 days**. Live screenshots showed **All Time**.

**Blocked on:** Anthony confirming intended default → extract `DEFAULT_RECENCY_FILTER` constant → extend mocked D-02 test + sync QA-TEST-PLAN.

---

## 7. What stays manual (deliberately)

- **Google Places live API** — mocked even in `e2e-live`; live tests use seeded Rosato's + local pub search
- **Formal RLS security audit (QA-04)** — `api-live` ownership tests will start closing this; full audit remains separate
- **TestFlight / App Store review** — inherently manual
- **Real device camera/EXIF** — P-09 covers crop logic in mocked suite; periodic phone spot checks still worth doing
- **`test:e2e:production`** — read-only canary against nicepints.com; separate from local Supabase suites

---

## Open questions for Anthony

1. ~~Folder vs tag for live tests?~~ → **Resolved: folder split (`e2e/live/`)**
2. ~~Supabase CLI first introduction?~~ → **Resolved: yes, via CI + `supabase/config.toml`**
3. **D-02:** is "30 days" or "All Time" the correct default for Find a Pint?
4. **Dublln:** raw geocoding response body when bug is reproduced
5. **When to gate deploy on `e2e-live`?** — currently parallel only; flip `deploy.needs` once CI is green for a few runs
6. **Vitest for `api-live`?** — confirm before adding Layer 2 job

---

## Roadmap (recommended order)

1. ✅ **`e2e-live` + base schema + live Playwright suite** — shipped
2. Merge PR, apply base migration to production, confirm CI green
3. **`api-live` + Vitest** — auth/post/delete data correctness + RLS ownership
4. **D-02 decision** → named constant + test + doc sync
5. **Dublln fixture** → unit test once raw response captured
6. Optionally **block deploy on `e2e-live`** when stable
