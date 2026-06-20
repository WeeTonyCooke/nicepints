# QA Test Plan — NicePints

Functional specification and manual test checklist for what is **built today**. Use this to verify web, iOS Simulator, and device builds before each release.

Related: [QA-NOTES.md](./QA-NOTES.md) (bug history) · [PRODUCT-VISION.md](./PRODUCT-VISION.md) (intent) · [ROADMAP.md](./ROADMAP.md) (what’s next)

---

## How testing works

### Environments

| Environment | How to run | Best for |
|-------------|------------|----------|
| **Web dev** | `npm run dev` → `http://localhost:3000` | Fast iteration, auth email links |
| **Web production build** | `npm run build && npm run preview` | Pre-release sanity |
| **iOS Simulator** | `cd nicepints && npm run cap:ios` → ▶ in Xcode | Safe areas, native camera/geo |
| **Physical iPhone** | Xcode → device | Real camera, location, TestFlight |

### Before each test pass

1. Note **date**, **tester**, **build** (git commit or `npm run build` date).
2. Confirm Supabase migrations are applied (see [Migrations checklist](#migrations-checklist)).
3. Use a **test email** you control; avoid rate limits (wait ~1h if blocked).

### Recording results

Update the **Test log** table at the bottom of this file:

| Result | Meaning |
|--------|---------|
| **Pass** | Works as specified |
| **Fail** | Broken — log issue in QA-NOTES or Linear |
| **Block** | Cannot test (migration missing, auth down, etc.) |
| **N/A** | Not in scope for this build |
| **Skip** | Deferred intentionally |

**Where QA lives:**

| Artifact | Purpose |
|----------|---------|
| **This file** (`QA-TEST-PLAN.md`) | Living functional spec + pass/fail log |
| **QA-NOTES.md** | Historical bugs, fix status, open issues |
| **ROADMAP.md** | Phase completion ticks |
| **Linear / GitHub Issues** | Track individual defects (optional) |

After a test pass: tick ROADMAP items, add failures to QA-NOTES under “Open issues”, and append a row to the Test log below.

**Agent/contributor rule:** user-facing changes must include Playwright updates in the same pass — see `.cursor/rules/tests-with-changes.mdc`.

### Automated checks (CI-local)

```bash
npm run typecheck   # TypeScript — must pass before release
npm run build       # Production bundle — must pass before cap:sync / App Store
npm run test:e2e    # Playwright — maps to IDs below (CI-safe, mocked Supabase)
npm run test:e2e:production   # Live nicepints.com read-only smoke (6 checks, no mocks)
```

**Playwright coverage (automated):** L-01, L-02, L-03, A-01, A-04, A-05, A-06, A-07, P-01–P-10, F-01–F-06, D-01–D-09, R-01–R-04, M-01, M-02 — see `e2e/*.spec.ts`.

**What CI mocks (and therefore misses unless we add explicit tests):**

| Area | CI behaviour | Gap until fixed |
|------|----------------|---------------|
| Supabase | REST/auth mocked | Real RLS, migrations, storage |
| Photo upload | Was: inject `input.files` directly | **P-08** now clicks the label + file picker |
| Google Places | Was: only local DB pubs in fixtures | **P-10** mocks Places API responses |
| Crop quality | Was: modal opens + confirm only | **P-09** checks 4:5 output aspect |
| Production Places key | Not hit in CI | Manual + live smoke; key config in DEPLOY.md |

**Still manual / live-only:**

| ID | Status | Notes |
|----|--------|-------|
| A-02 Magic link | ✅ Pass | Anthony, 2025-06-19 localhost |
| A-03 OTP code | ✅ Pass | Magic Link template saved — 6-digit code + link in inbox |
| R-05 iOS layout | ⏳ Open | Re-verify on Simulator after `cap:sync` |
| Live Supabase writes | ⏳ Open | CI mocks REST; run smoke script against production |
| Real Google Places key | ⏳ Open | Netlify env + GCP key restrictions — see DEPLOY.md |
| Phone EXIF / camera | ⏳ Open | Crop orientation needs device photos |

**GitHub Actions:** `.github/workflows/ci.yml` runs typecheck, build, and Playwright on every push/PR to `main`. Optional Netlify deploy via build hook — see [DEPLOY.md](./DEPLOY.md).

---

## Migrations checklist

Run in Supabase SQL editor if not already applied:

| Migration | Enables |
|-----------|---------|
| `20250617000000_phase1_moderation.sql` | Report pint, request pub |
| `20250619000000_pint_rename_policy.sql` | Rename pints when changing display name |
| `20250620000000_pint_delete_policy.sql` | Delete own pints (superseded by next) |
| `20250621000000_pint_user_id_ownership.sql` | Reliable pint delete |
| `20250622000000_phase2_discovery.sql` | Guinness 0.0, serving type, Find a Pour filters |
| `20250623000000_places_and_account_deletion.sql` | Google Places pubs, account delete RPC |

**Confirm in Supabase:** Authentication → migrations are not auto-tracked. If unsure, check for `google_place_id` on `pubs` and function `purge_my_account_data()`.

---

## Functional specification (current build)

### 1. First launch & compliance

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| L-01 | Age gate | On first launch, user must confirm legal drinking age before app content. Choice persists. |
| L-02 | Legal pages | `/legal` shows Privacy, Terms, Responsible drinking. Linked from Profile sign-in and Settings. |
| L-03 | Drink responsibly | Copy on Add Pint and Legal responsible section. |

### 2. Authentication & identity

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| A-01 | Sign in | Profile → email + name on pints → send sign-in email. |
| A-02 | Magic link | Email link opens app/web and signs user in → lands on Profile. |
| A-03 | OTP code | If email template has `{{ .Token }}`, 6-digit code verifies in Profile. |
| A-04 | Name prompt | First sign-in without `display_name` → “What should we call you?” modal. |
| A-05 | Name on pints | Plain name on feed (no `@`). Profile Settings can rename + update past pints. |
| A-06 | Email privacy | Email only in Profile Settings, not profile header. |
| A-07 | Sign out | Profile header → sign out returns to sign-in screen. |

### 3. Log a pint

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| P-01 | Auth at post time | Post opens sign-in sheet if not signed in; cannot complete without auth. |
| P-02 | Photo required | Cannot post without photo. Camera/gallery on native; file picker on web. |
| P-03 | Rating 1–10 | Grid selector; displays as `/10` everywhere. |
| P-04 | Pub selection | Search pub or bar (Google Places + DB). Manual add + report listing link. |
| P-05 | Products | Guinness, **Guinness 0.0**, Beamish, Murphy’s, Other. |
| P-06 | Serving type | Guinness / 0.0: Draught or Can chips. Saved to `serving_type`. |
| P-07 | Post success | Redirects to Feed; new pint visible with photo and name. |

### 4. Feed & detail

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| F-01 | Home feed | Photo-first cards; Top Pour hero; tap → pint detail. |
| F-02 | Pour label | Shows e.g. `Guinness 0.0 · On draught` when serving known. |
| F-03 | Pint detail | Full photo, score /10, pub, location, note, logged-by name, report button. |
| F-04 | Pub detail | Pub info, pint grid, add pint CTA with `?pubId=`. |
| F-05 | Report pint | Signed-in user can flag a pint; success message. |
| F-06 | Load errors | Network failures show retry UI. |

### 5. Find a Pour (discovery)

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| D-01 | Screen title | Tab **Find** → “Find a Pour”. |
| D-02 | 0.0 on Draught preset | Default filter: Guinness 0.0 + draught + last 30 days. |
| D-03 | Other presets | Guinness, All pours. |
| D-04 | Search | Filter by pub name or town. |
| D-05 | Recency | This week / month / all time. |
| D-06 | Min score | 8+ toggle. |
| D-07 | Result cards | Photo, pour label, distance (if location on), avg score, pour count. |
| D-08 | Empty state | Helpful message + link to log a pint. |
| D-09 | Location | Requests permission; sorts by distance when coords + pub lat/lng exist. |

### 6. Profile & my pints

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| R-01 | Stats | Total pints, avg rating, pubs visited, countries. |
| R-02 | My pints grid | Tap → pint detail. |
| R-03 | Edit / delete | Edit mode → bin → confirm → pint removed from feed. |
| R-04 | Settings | Email (read-only), rename name, legal links, report listing, delete account. |
| R-05 | iOS layout | Sign-in form: labels visible, no huge gaps, clears nav safe area. |

### 7. Moderation & crowdsourcing

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| M-01 | Report listing | Wrong/duplicate/closed pub form submits to `pub_requests`. |
| M-02 | Report pint | Submits to `pint_reports`. |

---

## Smoke test script (quick — ~15 min)

**Automated (production, read-only):** `npm run test:e2e:production` — age gate, feed, Find a Pour, Add Pint UI, Legal GDPR, Profile sign-in (6 checks against nicepints.com).

**Manual (requires your email + photo):** run after every `cap:sync` or major feature:

1. **Age gate** — fresh install / clear `nicepints_age_confirmed_v1` in storage → confirm → app loads.
2. **Sign in** — Profile → email → magic link or code → signed in.
3. **Log pint** — Guinness 0.0, On draught, photo, 8/10 → appears on Feed.
4. **Find** — 0.0 on Draught preset shows the pint.
5. **Delete** — Profile → Edit → delete that pint → gone from Feed.
6. **Legal** — Profile Settings → Privacy opens.

---

## Test log

Append a row after each pass. Do not delete old rows.

| Date | Tester | Build / env | Pass | Fail | Block | Notes |
|------|--------|-------------|------|------|-------|-------|
| 2025-06-19 | Anthony | Web localhost | A-01, A-02, R-03, P-07 | — | — | Auth + delete confirmed in chat |
| 2025-06-19 | Anthony | iOS Simulator | R-05 | — | — | Sign-in layout fix pending rebuild |
| 2025-06-19 | CI | GitHub Actions | — | — | — | Playwright smoke + typecheck wired |
| 2026-06-19 | CI | Playwright expanded | L-01–M-02 (37/41) | — | A-02,A-03,R-05 | `e2e/*.spec.ts`, mocked Supabase |
| 2026-06-17 | CI | Playwright suite | 40/40 tests | — | A-02,A-03,R-05 | REST mock PATCH/POST/DELETE; all green |
| 2026-06-17 | Anthony | Auth email | A-02, A-03 | — | — | Magic Link template saved — code + link in inbox |
| 2026-06-17 | — | Production `c201ee8` | — | — | Smoke | GDPR privacy live on nicepints.com; full smoke pass pending |
| 2026-06-17 | Anthony | Ops | Migrations, Netlify | — | — | All 6 Supabase migrations applied; `VITE_GOOGLE_PLACES_API_KEY` on Netlify |
| 2026-06-17 | CI | Production smoke | L-01, F-01, D-01, P-04, L-02, A-01 | — | Sign-in, P-07, R-03 | `npm run test:e2e:production` — 6/6 pass on nicepints.com |
| 2026-06-19 | CI | Playwright P-08–P-10 | Photo click, crop 4:5, Places mock | — | Live Places key | `.cursor/rules/tests-with-changes.mdc` added |

---

## Open issues (from testing)

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| QA-01 | Supabase OTP email may be magic link only until template saved | P1 | ✅ Template saved — code + link in inbox |
| QA-02 | Support contact email missing from Legal | P2 | ✅ Live — `hello@nicepints.com` on nicepints.com |
| QA-03 | No automated E2E tests | P3 | ✅ Playwright suite — 40 tests in `e2e/*.spec.ts` |
| QA-04 | RLS security audit not formalized | P2 | Deferred |
| QA-05 | All Supabase migrations confirmed in production | P1 | ✅ All 6 migrations applied |
| QA-06 | Production smoke test after `c201ee8` deploy | P1 | ✅ Automated 6/6 (`test:e2e:production`); manual sign-in/post/delete pending |
| QA-07 | `VITE_GOOGLE_PLACES_API_KEY` on Netlify | P1 | ✅ Confirmed |

When fixed, move rows to [QA-NOTES.md](./QA-NOTES.md) and mark ✅.

---

## What we do *not* test yet

- Push notifications
- Social reactions / comments / follows
- Sub-scores (Dome, similarity)
- Pub product inventory (official 0.0 on draught flag)
- App Store submission / TestFlight
- Android Capacitor build

See [ROADMAP.md](./ROADMAP.md) Phase 3+.
