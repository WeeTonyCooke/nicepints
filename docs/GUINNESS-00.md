# Guinness 0.0 — Product Deep Dive

Guinness 0.0 has its own vocabulary. People compare it directly against Guinness draught, and the debate is often less about the beer itself and more about **how it’s served**.

This doc is the source of truth for 0.0-specific UX, tags, sub-scores, and the **Find 0.0 on Draught** discovery feature.

Related: [GUINNESS-LEXICON.md](./GUINNESS-LEXICON.md) · [PRODUCT-VISION.md](./PRODUCT-VISION.md) · [ROADMAP.md](./ROADMAP.md)

---

## The problem people actually have

> “Where can I get Guinness 0.0 **on draught**?”

Heard constantly. Users don’t just want 0.0 — they want:

| Question | Why it matters |
|----------|----------------|
| Is it **available**? | Many pubs don’t stock it |
| Is it on **draught**? | Can vs tap is a different product experience |
| Is it **any good**? | Quality varies wildly by serve |
| Is it better than **the pub down the road**? | Comparative discovery |

A dedicated filter solves a **real problem** — not another generic review site.

---

## Guinness 0.0 terms

| Term | Meaning |
|------|---------|
| **Draught 0.0** | The holy grail. Guinness 0.0 from a tap, not a can. |
| **Can 0.0** | Standard Guinness 0.0 can. |
| **Nitro can** | 0.0 cans use the nitrogen widget like regular Guinness. |
| **Widget** | The little nitrogen ball inside the can. |
| **Pour test** | Whether the pub pours the can properly into a glass. |
| **Glassware** | Served in a proper Guinness glass? People care deeply. |
| **Temperature** | Huge factor. Too cold → flavour disappears. Too warm → sweet. |
| **Close to the real thing** | Probably the most common compliment. |
| **Indistinguishable** | Highest praise vs draught Guinness. |
| **Thin** | Common criticism. |
| **Sweet** | Common criticism. |
| **Missing the bite** | Lacks the slight bitterness of draught Guinness. |
| **Good settle** | Looks like real Guinness when poured. |
| **Fake Guinness** | Usually said jokingly. |

---

## What people judge (0.0-specific)

### Appearance

- Does it settle properly?
- Does it have a dome?
- Is the head creamy?
- Does it **look like Guinness**?

### Taste

- Is it close to regular Guinness?
- Is it too sweet?
- Is it watery?
- Does it have the roasted flavour?

### Serve

- Proper Guinness glass?
- Poured correctly?
- Cold enough (but not too cold)?
- **Draught or can?**

---

## NicePints 0.0 rating model (proposed)

When `product = Guinness 0.0`, show product-specific fields. Regular Guinness can use the Dome Score model from the lexicon doc.

### Serve type (required)

```
○ Draught 0.0    ← maps to serving_type: draught
○ Can 0.0        ← maps to serving_type: can
```

### Sub-scores (optional — “Serious rate” mode)

| Field | Slug | What it captures |
|-------|------|------------------|
| **Overall** | `score_overall` | Gut feel 1–10 (required) |
| **Appearance** | `score_appearance` | Settle, dome, head, looks like Guinness |
| **Similarity to Guinness** | `score_similarity` | “Close to the real thing” / indistinguishable |
| **Creaminess** | `score_creaminess` | Mouthfeel, nitro quality |

*Regular Guinness draught keeps: Dome, Creaminess, Presentation, Value.*

### Product-aware forms

```
if product.is_non_alcoholic && product.slug == 'guinness-00':
  show 0.0 sub-scores + 0.0 tags
else if product.slug == 'guinness':
  show Dome Score sub-scores + draught tags
else:
  show overall + generic tags only
```

Schema: nullable columns on `pints` work for v1; product-specific score sets can move to JSONB later if needed.

---

## Guinness 0.0 tags

### Positive

| Tag | Slug | Notes |
|-----|------|-------|
| ☁️ Great Dome | `great_dome` | Shared with draught Guinness |
| 🥛 Creamer | `creamer` | Shared |
| 🎯 Close to the Real Thing | `close_to_real_thing` | **0.0-specific** — top compliment |
| ✨ Indistinguishable | `indistinguishable` | **0.0-specific** — highest praise |
| 🍺 Draught 0.0 | `draught_00` | **Serve badge** — from tap |
| 📦 Can Pour | `can_pour` | **Serve badge** — poured from can |
| ❄️ Perfect Temperature | `perfect_temperature` | **0.0-specific** |
| 🧼 Clean Glass | `clean_glass` | Shared |
| 🍀 Worth the Trip | `worth_the_trip` | Shared — strong discovery signal |
| ✨ Good Settle | `good_settle` | **0.0-specific** — looks like Guinness |

### Negative

| Tag | Slug | Notes |
|-----|------|-------|
| 😕 Thin | `thin` | **0.0-specific** |
| 🍬 Too Sweet | `too_sweet` | **0.0-specific** |
| 😐 Missing the Bite | `missing_the_bite` | **0.0-specific** |
| 🌡️ Too Cold | `too_cold` | **0.0-specific** — flavour killed |
| 🌡️ Too Warm | `too_warm` | Shared |
| 📦 Poor Pour | `poor_pour` | Can not poured properly |
| 🥃 Wrong Glass | `wrong_glass` | **0.0-specific** — glassware matters |

---

## Example pint card (0.0 on draught)

```
Guinness 0.0 · Draught 0.0
O'Donoghue's · 0.8 km · Posted nearby

Overall: 9.1
Appearance: 9/10
Similarity to Guinness: 9/10
Creaminess: 8/10

Tags: 🍺 Draught 0.0 · 🎯 Close to the Real Thing · ☁️ Great Dome
[photo]
```

---

## Killer feature: Find 0.0 on Draught

### Hero filter (target UI)

Preset name: **“0.0 on Draught”**

```
☑ Guinness 0.0 available
☑ Guinness 0.0 on draught
☑ Rated 8+ / 10
☑ Within 5 km
```

### How each filter maps (architecture)

| UI filter | Data source |
|-----------|-------------|
| **0.0 available** | `pub_products` where `product = guinness-00` OR ≥1 pint rating exists |
| **0.0 on draught** | `pub_products.serving_types` includes `draught` OR pints with `product + serving_type = draught` |
| **Rated 8+** | Weighted `score_overall` ≥ 8 from recent pints matching product + serving |
| **Within 5 km** | `haversine(user, pub)` ≤ 5 |

**v1 shortcut (before `pub_products`):** infer availability from user ratings only — “pubs with a Guinness 0.0 draught rating in last 90 days.” Less complete but shippable.

**v2:** `pub_products` table + “I confirm this pub serves 0.0 on draught” on first rating at a pub.

### Result card

- Pub name + distance
- **Draught 0.0** badge (if confirmed)
- Weighted score (e.g. 8.6 from 4 ratings this month)
- Thumbnail: latest real photo of 0.0 pour at this pub
- Tags preview: `Close to the Real Thing` if common

### Why this wins

| Generic pub app | NicePints 0.0 filter |
|-----------------|----------------------|
| “Bars near me” | “0.0 on draught, 8+, within 5km” |
| One pub rating | Rating for **this product + this serve** |
| No photo proof | Recent user photo required |
| Static listings | Crowdsourced + recency-weighted |

---

## Pub availability vs user ratings

Two layers — don’t conflate:

| Layer | Source | Purpose |
|-------|--------|---------|
| **Pub facts** | Owner claim, admin, or `pub_products` | “They serve 0.0 on draught” (availability) |
| **User ratings** | `pints` table | “It’s an 8.5 pour” (quality) |

First user to rate 0.0 draught at a pub effectively **discovers** availability for everyone — good bootstrap until pub facts exist.

---

## Copy & positioning (0.0)

- Lead with: **“Find Guinness 0.0 on draught near you.”**
- Sub: “Rated by people who care about the pour.”
- Avoid: “Best non-alcoholic beer” (generic, weak)
- Embrace: “Close to the real thing” (authentic pub language)

Non-alcoholic positioning also helps App Store: utility/discovery, not “drink more.”

---

## Open questions (0.0-specific)

| Question | Options | Decision |
|----------|---------|----------|
| Require similarity sub-score for 0.0? | Optional · Prompt after photo | TBD — optional v1 |
| Separate 0.0 leaderboard? | Yes · No | TBD — yes for marketing |
| “Confirm 0.0 on draught” on first rating? | Yes · Infer only | TBD — yes, one tap |
| Temperature as tag only or sub-score? | Tag · Sub-score | TBD — tag first (simpler) |

---

## Decisions log (0.0)

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-06 | Guinness 0.0 is a first-class product, not a variant flag | Own vocabulary, serve debate, discovery hook |
| 2025-06 | Draught 0.0 = primary discovery preset | Matches most common user question |
| — | — | — |
