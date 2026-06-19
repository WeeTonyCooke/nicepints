# Roadmap & Architecture

Phased plan designed for scalability. Schema changes in early phases should support the killer feature without rewrites later.

---

## Architecture principles

1. **Rating identity** = `pub_id` + `product_id` + `serving_type` (+ optional `user_id` for dedup).
2. **Products** and **tags** are curated tables, not hardcoded forever.
3. **Photos required** for new ratings in discovery; legacy rows can keep fallbacks.
4. **Recency** applied at query time (weighted scores), not just stored averages.
5. **Trust metadata** stored at post time (lat/lng, `posted_nearby` flag) — don’t recompute later.
6. **Pub facts** (serves 0.0 on draught, hours) separate from **user ratings**.

---

## Target data model (sketch)

```
products
  id, name, brand, abv, is_non_alcoholic, slug, active

pubs
  id, name, city, country, latitude, longitude
  -- future: google_place_id, hours, claimed_by

pub_products (what a pub actually serves)
  pub_id, product_id, serving_types[], verified_at, source

pints (ratings)
  id, pub_id, product_id, serving_type
  user_id, user_name
  score_overall
  -- Guinness draught sub-scores (nullable):
  score_dome, score_creaminess, score_presentation, score_value
  -- Guinness 0.0 sub-scores (nullable):
  score_appearance, score_similarity
  caption, photo_url, photo_required
  posted_latitude, posted_longitude, posted_nearby
  created_at

pint_tags
  pint_id, tag_slug

pub_requests (crowdsource)
  id, user_id, name, city, country, note, status, created_at

reports
  id, pint_id, reporter_id, reason, status, created_at
```

### Migration from today

Current `pints` table maps roughly to:

| Today | Target |
|-------|--------|
| `pint_type` (enum string) | `product_id` FK |
| `score` | `score_overall` |
| `caption` | `caption` |
| `photo_url` | `photo_url` |
| — | `serving_type` (new, default `draught`) |
| — | `posted_latitude`, `posted_longitude`, `posted_nearby` |
| — | sub-scores nullable |
| — | `pint_tags` junction |

---

## Phases

### Phase 0 — Shippable baseline ✅ (mostly done)

- [x] TypeScript build (`tsc -b`)
- [x] Async data loading + error states
- [x] Auth (email OTP)
- [x] Geolocation nearby sort
- [x] Photo upload validation
- [x] Legacy dead code removed
- [ ] Commit + push Capacitor / auth work to GitHub

**Supabase setup (Phase 1):** run `supabase/migrations/20250617000000_phase1_moderation.sql` in the SQL Editor to enable pub requests and pint reports.

### Phase 1 — App Store readiness

**Goal:** Pass review, no dead ends.

- [x] Age gate (first launch, persisted in localStorage)
- [x] About / Legal screen (privacy, terms, responsible drinking)
- [x] Report pint (flag → admin queue via `pint_reports`)
- [x] Request a pub form → `pub_requests` table
- [x] Require photo on new posts (remove fallback for inserts)
- [ ] Run Supabase migration `20250617000000_phase1_moderation.sql`
- [ ] Fix Supabase OTP email (6-digit code, not magic link)
- [ ] Add support contact email in Legal before submission

**Auth email:** paste `supabase/email-templates/magic-link.html` into Supabase → Authentication → Email Templates → Magic Link. See [SUPABASE-AUTH.md](./SUPABASE-AUTH.md).

### Phase 2 — Killer feature foundation

**Goal:** Query “best Guinness 0.0 draught near me, recent, with photo.”

- [ ] `products` table + seed (Guinness, Guinness 0.0, …)
- [ ] `serving_type` on pints (`draught | can | bottle | unknown`)
- [ ] Migrate `pint_type` → `product_id`
- [ ] Capture location at post → `posted_nearby` badge
- [ ] Recency filter in queries (7 / 30 / 90 days)
- [ ] Pub search on Nearby (name + city)
- [ ] Weighted score helper (recent = higher weight)

### Phase 3 — Find a Pour (hero UX)

**Goal:** Discovery is the home screen story. **Lead preset: Guinness 0.0 on draught.**

- [ ] Rename/reframe Nearby → **Find a Pour**
- [ ] Filter bar: product · serving · distance · recency · min score
- [ ] **“0.0 on Draught” preset** — see [GUINNESS-00.md](./GUINNESS-00.md)
  - ☑ 0.0 available · ☑ on draught · ☑ rated 8+ · ☑ within 5km
- [ ] Preset chips (Guinness 0.0 draught near me)
- [ ] Result cards: score + distance + **latest real photo** + serve badge
- [ ] Pub detail: breakdown by product + serving (incl. 0.0 draught vs can)
- [ ] Feed: hide stock fallback images from hero

### Phase 4 — Guinness personality

**Goal:** Tags + product-aware sub-scores (Dome Score for draught, Similarity for 0.0).

- [ ] Tag picker on Add Pint (curated list — product-filtered tag sets)
- [ ] **0.0 tag set** (`close_to_real_thing`, `draught_00`, `too_sweet`, …)
- [ ] Display tags on pint detail + cards
- [ ] Optional sub-scores — **product-aware forms** (see GUINNESS-00.md)
- [ ] “Serious rate” expanded form for power users
- [ ] “Confirm 0.0 on draught at this pub” on first 0.0 rating
- [ ] Tag facets in discovery (later)

### Phase 5 — Retention, trust & social

- [ ] Simple 🍺 / “Serious pint” reaction
- [ ] Favourite product filter (saved prefs)
- [ ] **Share pour** — Capacitor native share sheet (image + score + link) — see [SOCIAL-AND-TRENDS.md](./SOCIAL-AND-TRENDS.md)
- [ ] Push notifications (Capacitor + Supabase)
- [ ] Rate limits + abuse rules
- [ ] Pub correction request flow
- [ ] RLS audit + storage policies

### Phase 5b — Trends (language & data)

- [ ] Tag + product+serving rollups (city / national, 7d / 30d)
- [ ] “This week in pours” feed card
- [ ] Lexicon flywheel: crowd phrases → candidate tags (admin review)
- [ ] Caption mining against known lexicon terms (lightweight)

### Phase 6 — Scale & polish

- [ ] Branded **share card** image generation + deep links (`nicepints.app/pint/:id`)
- [ ] Google Places pub search / add
- [ ] `pub_products` (“serves 0.0 on draught”)
- [ ] Claimed pub profiles (owner facts only)
- [ ] Smoke / e2e tests
- [ ] TestFlight → App Store

---

## Scoring formulas (draft)

### Weighted pub+product+serving score

```
weight = max(0, 1 - (days_old / 90))   // linear decay over 90 days
display_score = sum(score * weight) / sum(weight)
```

Tune after real data. Alternative: step weights (7d = 1.0, 30d = 0.7, 90d = 0.4, older = 0.1).

### Posted nearby

```
posted_nearby = haversine(user_coords, pub_coords) <= 0.2 km at submit time
```

---

## Open technical decisions

| Topic | Notes | Status |
|-------|-------|--------|
| Sub-scores nullable vs separate table | Nullable columns simpler for v1 | TBD |
| Tags: array vs junction | Junction better for analytics | TBD |
| Product catalog admin | Supabase dashboard manual seed OK for now | TBD |
| Image moderation | Manual review queue vs third-party API | TBD |
| Offline queue for posts | Nice for pubs with bad signal | Defer |

---

## Decisions log

Add entries as we ship and learn:

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-06 | Overall score 1–10 (not /5) | Matches Add Pint input scale |
| 2025-06 | Auth required to post | Anti-abuse + real identity |
| 2025-06 | Killer feature = product + serving + photo + recency + nearby | Differentiated discovery |
| 2025-06 | Guinness 0.0 = first-class product with own tags/sub-scores | Serve debate is the user problem; see GUINNESS-00.md |
| 2025-06 | Phase 1 App Store pack implemented in app code | Age gate, legal, report, request pub, photo required |
| 2025-06 | Rams/Braun design principles adopted | See DESIGN-PRINCIPLES.md — steer all UI/features |
| 2025-06 | Magic Link email template in repo | `supabase/email-templates/magic-link.html` |
