# QA Notes (Consolidated)

Findings from ChatGPT and Claude QA passes, plus fix status. **For active testing use [QA-TEST-PLAN.md](./QA-TEST-PLAN.md).**

---

## Critical — fix status

| # | Issue | Status |
|---|-------|--------|
| 1 | `PintDetail` async `getPintById` crash | ✅ Fixed |
| 2 | Rating 1–10 vs `/5` display | ✅ Fixed → `/10` |
| 3 | Dead `DataContext` + legacy pages | ✅ Deleted |
| 4 | Legacy pages used wrong field names | ✅ Deleted with pages |
| 5 | `MapPage` missing lat/lng | ✅ Replaced by `MapView` / Find a Pour |
| 6 | Hardcoded `TonyCooke` user | ✅ Auth required |
| 7 | Fake static Profile | ✅ Real auth + stats |
| 8 | `country` hardcoded Ireland on pints | ✅ Reads from `pubs.country` join |
| 9 | Nearest sort alphabetical | ✅ Geolocation + distance |
| 10 | Pub not pre-selected from PubDetail | ✅ `?pubId=` query param |
| 11 | `capture="environment"` blocks iOS gallery | ✅ Removed on web input |
| 12 | `.env` in repo | ✅ Gitignored |

---

## Phase 1 App Store — fix status

| Item | Status |
|------|--------|
| Age gate | ✅ |
| Legal / privacy / terms / responsible | ✅ |
| Report pint | ✅ |
| Request pub | ✅ |
| Photo required on new posts | ✅ |
| Delete own pint (Profile) | ✅ |
| BFM identity (no @, name prompt, email in settings) | ✅ |

---

## Phase 2 discovery — fix status

| Item | Status |
|------|--------|
| Guinness 0.0 product | ✅ |
| Serving type (draught / can) | ✅ |
| Find a Pour + 0.0 on Draught preset | ✅ |
| Pub/town search on Find | ✅ |
| Recency + 8+ filters | ✅ |
| Phase 2 Supabase migration | ⏳ User must run SQL |

---

## Still open

| # | Issue | Priority |
|---|-------|----------|
| 1 | Supabase OTP email template (`{{ .Token }}`) | P0 auth |
| 2 | Support contact email in Legal | P1 App Store |
| 3 | `supabaseClient` hard crash if no `.env` | P2 |
| 4 | Formal RLS security audit | P1 security |
| 5 | Automated E2E / smoke tests in CI | ✅ Playwright — 6 smoke tests |
| 6 | iOS Simulator sign-in layout (safe area, 16px inputs) | P1 — fix in progress |
| 7 | Push notifications | P3 — deferred |
| 8 | Social reactions / comments | P3 — deferred |

---

## How to record new QA

1. **Reproduce** on web + simulator if UI-related.
2. **Log** in [QA-TEST-PLAN.md](./QA-TEST-PLAN.md) Test log + Open issues.
3. **Fix** → move to fix status table above with ✅.
4. **Regression** — re-run smoke test script in QA-TEST-PLAN.

---

## Duplicate zip / nested folder

Early zips contained `nicepints/nicepints/`. Not present in current workspace. Root app is canonical.
