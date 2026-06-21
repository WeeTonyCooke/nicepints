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
| Privacy policy v2 (GDPR) | ✅ Live on nicepints.com |
| Support contact email in Legal | ✅ `hello@nicepints.com` |
| Report pint | ✅ |
| Request pub / report listing | ✅ |
| Photo required on new posts | ✅ |
| Delete own pint (Profile) | ✅ |
| Delete account (Profile → Settings) | ✅ |
| BFM identity (no @, name prompt, email in settings) | ✅ |
| Supabase OTP email (6-digit code) | ✅ Magic Link template saved |
| Google OAuth sign-in | ✅ |
| Post-time auth sheet on Add Pint | ✅ |

---

## Phase 2 discovery — fix status

| Item | Status |
|------|--------|
| Guinness 0.0 product | ✅ |
| Serving type (draught / can) | ✅ |
| Find a Pour + 0.0 on Draught preset | ✅ |
| Pub/town search on Find | ✅ |
| Recency + 8+ filters | ✅ |
| Google Places pub search on Add Pint | ✅ |
| `products` table + `product_id` backfill (migration) | ✅ SQL in repo |
| Product discovery migration (`product_regions`, metrics) | ✅ SQL in repo — apply `20250624000000_*` in Supabase |
| App writes `product_id` on insert | ✅ `saveLivePint()` — commit `794eab8` |
| Add Pint loads products from Supabase (featured / recent / search) | ✅ |
| Discovery filters by product slug / `product_id` | ✅ |
| Pub detail groups pours by product | ✅ |
| Weighted / recency-weighted scores | ⏳ Plain average today |
| `posted_nearby` at post time | ⏳ Not built |
| Phase 2 Supabase migration | ✅ Applied |
| Product discovery migration in production | ✅ Applied |
| Expand IE product catalog migration | ⏳ Apply `20250624100000_expand_ie_product_catalog.sql` |
| Places + account deletion migration | ✅ Applied |

---

## Still open

| # | Issue | Priority |
|---|-------|----------|
| 1 | Apply expanded product catalog migration (`20250624100000_*`) | P1 — adds Smithwick's, Bulmers, etc. |
| 2 | Confirm all 8 Supabase migrations applied in production | ✅ |
| 3 | `VITE_GOOGLE_PLACES_API_KEY` on Netlify — server key (no HTTP referrer restriction) | ✅ |
| 4 | Production smoke test (`npm run test:e2e:production`) | ✅ 6/6 automated pass |
| 5 | Manual smoke: sign in → log **Guinness 0.0** on draught → Find preset → delete | P1 — needs your email + photo |
| 6 | Formal RLS security audit | P1 security |
| 7 | iOS Simulator sign-in layout (R-05) — re-verify after rebuild | P1 |
| 8 | Feed hero excludes stock/fallback photos | P2 |
| 9 | Drink suggestions UI ("Can't find your drink?") | P3 — schema ready, no UI yet |
| 10 | Push notifications | P3 — deferred |
| 11 | Social reactions / comments | P3 — deferred |

---

## How to record new QA

1. **Reproduce** on web + simulator if UI-related.
2. **Log** in [QA-TEST-PLAN.md](./QA-TEST-PLAN.md) Test log + Open issues.
3. **Fix** → move to fix status table above with ✅.
4. **Regression** — re-run smoke test script in QA-TEST-PLAN.

---

## Duplicate zip / nested folder

Early zips contained `nicepints/nicepints/`. Not present in current workspace. Root app is canonical.
