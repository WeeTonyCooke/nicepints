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

### Automated checks (CI-local)

```bash
npm run typecheck   # TypeScript — must pass before release
npm run build       # Production bundle — must pass before cap:sync / App Store
npm run test:e2e    # Playwright smoke — maps to IDs below (CI-safe, mocked Supabase)
```

**Playwright coverage (automated):** L-01, F-01, D-01, A-01, L-02, P-01 — see `e2e/smoke.spec.ts`.

**GitHub Actions:** `.github/workflows/ci.yml` runs typecheck, build, and Playwright on every push/PR to `main`. Optional Netlify deploy via build hook — see [DEPLOY.md](./DEPLOY.md).

Auth, post pint, delete, and real Supabase flows remain **manual** until test credentials are added to CI secrets.

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
| P-01 | Auth required | Cannot post without sign-in. |
| P-02 | Photo required | Cannot post without photo. Camera/gallery on native; file picker on web. |
| P-03 | Rating 1–10 | Grid selector; displays as `/10` everywhere. |
| P-04 | Pub selection | City → pub dropdown. Request pub link works. |
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
| R-04 | Settings | Email (read-only), rename name, legal links, request pub. |
| R-05 | iOS layout | Sign-in form: labels visible, no huge gaps, clears nav safe area. |

### 7. Moderation & crowdsourcing

| ID | Requirement | Expected behaviour |
|----|-------------|------------------|
| M-01 | Request pub | Form submits to `pub_requests`. |
| M-02 | Report pint | Submits to `pint_reports`. |

---

## Smoke test script (quick — ~15 min)

Run after every `cap:sync` or major feature:

1. **Age gate** — fresh install / clear `nicepints_age_confirmed_v1` in storage → confirm → app loads.
2. **Sign in** — Profile → email → magic link or code → signed in.
3. **Log pint** — Guinness 0.0, On draught, photo, 8/10 → appears on Feed.
4. **Find** — 0.0 on Draught preset shows the pint (after Phase 2 migration).
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

---

## Open issues (from testing)

| ID | Issue | Severity | Status |
|----|-------|----------|--------|
| QA-01 | Supabase OTP email may be magic link only until template saved | P1 | Open — see SUPABASE-AUTH.md |
| QA-02 | Support contact email missing from Legal | P2 | Open |
| QA-03 | No automated E2E tests | P3 | Deferred |
| QA-04 | RLS security audit not formalized | P2 | Deferred |

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
