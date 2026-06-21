# Guinness Lexicon & NicePints Language

Authentic vocabulary for UI copy, tags, and optional sub-scoring. Some terms are universal, some Irish, some pub folklore masquerading as science — all of it is culture worth reflecting in the app.

---

## Core Guinness terms

| Term | Meaning |
|------|---------|
| **Dome** | Creamy head sitting slightly proud of the rim. Usually positive. |
| **Creamer** | Thick, creamy head and smooth texture. Praise. |
| **Settle** | Cascading effect after pouring. “Let it settle.” |
| **Surge** | Nitrogen bubbles cascading down the glass. |
| **Head** | Creamy top layer. |
| **Lacing** | Rings left on the glass as you drink. Good lacing → good pint signal. |
| **Two-part pour** | Traditional pour: fill ~¾, settle, top up. |
| **Collar** | Another word for the head. |
| **Creamy** | Smooth mouthfeel. Positive. |
| **Velvety** | Premium compliment. |
| **Silky** | Similar to velvety. |

---

## Positive pub talk (UI / marketing copy)

- “That’s a serious pint.”
- “That’s a proper Guinness.”
- “A lovely drop.”
- “A cracking pint.”
- “A tidy pint.”
- “She’s a beauty.”
- “You’d drink a few of them.”
- “That’s pouring well.”
- “Good stick.”
- “Lovely dome on it.”

---

## Negative pub talk

| Term | Meaning |
|------|---------|
| **Flat** | Lacking nitrogen / creaminess. |
| **Lifeless** | No sparkle or texture. |
| **Dead pint** | Poor condition. |
| **Loose head** | Thin, disappearing head. |
| **Big head** | Too much foam. |
| **Short pint** | Underfilled. |
| **Warm pint** | Too warm. |
| **Sour pint** | Dirty lines or poor quality. |
| **Metallic** | Off flavour. |
| **Dirty glass** | Grease affecting head retention. |

---

## Guinness nerd terms (online / power users)

| Term | Meaning |
|------|---------|
| **Dome rating** | Rating the shape of the head. |
| **Split the G** | Drink until the Guinness logo is perfectly split. |
| **Head retention** | How well the head lasts. |
| **Presentation** | Visual quality of the pour. |
| **Line cleanliness** | Condition of the beer lines. |
| **Nitro balance** | Nitrogen / CO₂ balance. |
| **First sip test** | Initial mouthfeel and creaminess. |
| **Last inch test** | Whether the pint stays good to the end. |

---

## NicePints tags (proposed)

Tags instead of forcing detailed scoring on every user. Multi-select, optional, shown on pint cards and used for discovery filters later.

### Positive

| Tag | Slug | Notes |
|-----|------|-------|
| 🏆 Serious Pint | `serious_pint` | Top-tier praise |
| ☁️ Great Dome | `great_dome` | Photo-friendly |
| 🥛 Creamer | `creamer` | Thick head |
| ✨ Perfect Settle | `perfect_settle` | Good cascade |
| 🧼 Clean Glass | `clean_glass` | Presentation |
| 🍀 Worth the Trip | `worth_the_trip` | Discovery signal |
| 📸 Pint of the Day | `pint_of_the_day` | User-curated highlight |
| ⭐ Local Favourite | `local_favourite` | Repeat visit signal |

### Negative

| Tag | Slug | Notes |
|-----|------|-------|
| 😕 Flat | `flat` | Common complaint |
| 🌡️ Too Warm | `too_warm` | Temperature |
| 🍺 Short Pour | `short_pour` | Underfill |
| 🫧 Poor Head | `poor_head` | Head issues |
| 🧽 Dirty Glass | `dirty_glass` | Presentation |
| 💸 Overpriced | `overpriced` | Value signal |

### Implementation notes

- Store as `text[]` on `pints` or junction table `pint_tags(tag_id)` for analytics.
- Curated list in code/DB — no free-text tags in v1 (spam risk).
- Tags are **optional**; overall score remains required.

---

## Dome Score concept (Guinness-focused differentiator)

People will upload photos to show off a perfect dome. Lean into it.

### Example pint card

```
Overall: 9.2
Dome: 10/10
Creaminess: 9/10
Presentation: 10/10
Value: 8/10

Tags: ☁️ Great Dome · 🥛 Creamer · 🍀 Worth the Trip
```

### Sub-score definitions (for when we build this)

| Sub-score | What it captures |
|-----------|------------------|
| **Dome** | Head shape, height, pride above rim |
| **Creaminess** | Mouthfeel, texture, “creamer” quality |
| **Presentation** | Glass cleanliness, pour, settle, lacing |
| **Value** | Price vs quality (subjective) |
| **Overall** | Gut feel 1–10 (can be user-set or derived) |

### UX options

1. **Quick rate** — Overall only + optional tags (low friction).
2. **Serious rate** — Expand to sub-scores (power users, Guinness nerds).
3. **Photo-first** — After photo upload, prompt “Rate the dome” with visual reference.

### Why this beats generic stars

- Matches how people actually talk about Guinness.
- Photos become purposeful (dome shots).
- Gives NicePints a personality generic review apps can’t copy.

---

## Copy tone guide

- Sound like the pub, not a SaaS app.
- Prefer “serious pint” over “excellent rating.”
- Prefer "log a pint" / "find a pint" over "submit review."
- Never encourage excessive drinking.
- Celebrate quality, not quantity.

---

## Future: tag-driven discovery

“Show me pints tagged **Great Dome** + **Guinness 0.0** + **draught** within 2km this month.”

Tags become facets in the Find a Pint engine alongside product, serving, and recency.

---

## Guinness 0.0

Guinness 0.0 has **its own vocabulary, tags, and sub-scores** — the serve debate (draught vs can) is central.

See **[GUINNESS-00.md](./GUINNESS-00.md)** for:

- 0.0 term glossary (Draught 0.0, widget, pour test, “close to the real thing”, etc.)
- Appearance / taste / serve judging criteria
- 0.0-specific tags (`close_to_real_thing`, `draught_00`, `too_sweet`, …)
- **Find 0.0 on Draught** filter spec
- Product-aware rating forms (0.0 vs draught Guinness)
