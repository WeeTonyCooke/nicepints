# Product Vision

## One-line pitch

**NicePints — find the best pint near you, with recent photos to prove it.**

## Killer feature (north star)

> **Find me the best Guinness / Guinness 0.0 near me, verified by recent user photos.**

This is the App Store screenshot, the word-of-mouth hook, and the build priority filter. Every feature should either support this query or get deferred. Evaluate ideas against [DESIGN-PRINCIPLES.md](./DESIGN-PRINCIPLES.md) — especially **#11: The pint is the product**.

### What “verified” means (honest v1)

Do **not** claim “verified in pub” without proof. Ship honest badges:

| Badge | Meaning |
|-------|---------|
| **Recent photo** | User-uploaded image, posted within N days (e.g. 30) |
| **Posted nearby** | Device location within ~200m of pub at submit time |
| **No badge** | Older post, no location, or legacy/stock image |

### Discovery query (target state)

```
product     = Guinness 0.0
serving     = draught
distance    ≤ 1 km
recency     ≤ 30 days
has_photo   = true (real upload, not fallback)
sort        = weighted score (recent ratings count more)
```

Preset chips on hero screen:

- **Guinness 0.0 · Draught · Near me** ← primary preset (see [GUINNESS-00.md](./GUINNESS-00.md))
- Guinness · Draught · This week
- Recently rated nearby

### Guinness 0.0 hero filter (killer UI)

The most valuable screen may be a dedicated preset, not a generic search:

```
☑ Guinness 0.0 available
☑ Guinness 0.0 on draught
☑ Rated 8+ / 10
☑ Within 5 km
```

This answers: *“Where can I get a good Guinness 0.0 on draught near me?”* — a question people ask constantly and can’t solve with Google Maps or generic pub apps.

Full 0.0 vocabulary, judging criteria, and rating model: [GUINNESS-00.md](./GUINNESS-00.md).

---

## Product thesis

A rating is **not** “this pub is 4.2 stars.” It is:

```
pub + product + serving_type → many pint ratings over time
```

Examples:

- Great **Guinness draught**, poor **Guinness 0.0 can** at the same pub.
- A 2023 score should not dominate discovery — **freshness matters**.

---

## Core concepts (from product thinking)

### 1. Verified pint vs random review

- Timestamp always (`created_at`).
- Optional location at post for “posted nearby.”
- Gallery/old photos: no badge, lower discovery weight.

### 2. Draught vs can/bottle

Critical for Guinness vs Guinness 0.0. Serving type is first-class:

`draught | can | bottle | unknown`

### 3. Beer / product identity

Curated catalog in Supabase `products` table — Guinness, Guinness 0.0, Beamish, Murphy's, Other to start; expandable without app deploy.

Add Pint loads **featured** drinks by country (`product_regions`), **recently logged** products for signed-in users, and **search all drinks** for the full active catalogue. New pints save `product_id` (with `pint_type` kept for compatibility).

See [drink-discovery-architecture-v1.0.md](./drink-discovery-architecture-v1.0.md).

### 4. Pub-level vs pint-level score

Pub detail shows breakdown:

- Overall (all products)
- Per product + serving: “Guinness draught 8.4 (12 ratings, 4 this month)”

### 5. Freshness

Display score = weighted average (e.g. last 90 days full weight, older decays).

Show: “12 ratings · 4 this month.”

### 6. Anti-abuse

Minimum: report pint, rate limits, sign-in to post, optional one rating per user/pub/product/serving per 24h.

### 7. Discovery angle (the real hook)

Filters: product · serving · distance · recency.

Nearby tab becomes **Find a Pint**, not a pub yellow-pages.

### 8. Rating system options

**Option A — Simple (ship first)**  
Overall 1–10 + optional tags (see [GUINNESS-LEXICON.md](./GUINNESS-LEXICON.md)).

**Option B — Guinness culture (differentiator)**  
Overall + Dome / Creaminess / Presentation / Value sub-scores + tags. See “Dome Score” in lexicon doc.

**Recommendation:** A for v1 launch volume; evolve toward B as Guinness-focused identity.

### 9. App Store / legal

- Age gate on first launch (17+ positioning, market-dependent).
- Privacy policy + terms (UGC, photos, location).
- Responsible drinking copy — avoid “drink more” language.
- Report/remove inappropriate content.
- Category: alcohol-adjacent social / reviews.

### 10. Pub owner correction flow

Separate from reviews. “Suggest correction” → moderation queue.

Owners update **facts** (serves 0.0 on draught: yes/no), never user scores.

---

## Social & retention (later)

Today: personal journal + browse others’ pints. No likes, comments, follow, search, or push.

Minimum social layer: one-tap **“Serious pint 🍺”** reaction.

Retention: push when new ratings match saved filter (“Guinness 0.0 draught within 1km”).

---

## Launch blockers (non-negotiable before App Store)

- [x] Age gate
- [x] Privacy policy + terms linked in-app
- [x] Report pint flow
- [x] Request / add pub (user not dead-ended if local missing)
- [x] Require photo on new posts (no stock feed)
- [x] Run Supabase migration for `pub_requests` + `pint_reports`
- [x] Support contact email in Legal page
- [x] Fix Supabase OTP (6-digit code)

---

## Positioning vs generic pub apps

| Generic | NicePints |
|---------|-----------|
| Rate the pub | Rate the **pour** |
| One star score | Product + serving + recency |
| Static listing | Photo proof + nearby discovery |
| 5-star review | Guinness culture (dome, creamer, tags) |

---

## Open product questions

Record decisions here as we learn:

| Question | Options | Decision |
|----------|---------|----------|
| Guinness-only brand vs multi-product? | Guinness-first · Multi-beer | TBD — lean Guinness-first UI, multi-beer data model |
| Sub-scores at launch? | Overall only · Dome Score lite | TBD |
| 0.0-specific sub-scores? | Overall only · Appearance + Similarity | TBD — see [GUINNESS-00.md](./GUINNESS-00.md) |
| Google Places for pubs? | Manual/request · Places API | **Places API** — shipped; server key via Netlify functions |
| Photo required? | Yes · Strong nudge | **Required** on new posts |
| Product catalog source? | Hardcoded enum · Supabase `products` | **Supabase** — shipped `794eab8` |
