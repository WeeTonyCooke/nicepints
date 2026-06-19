# Social Sharing & Language Trends

How NicePints learns from what drinkers say, surfaces trends, and gets pint photos out to social media — without becoming a generic “social network.”

Related: [GUINNESS-LEXICON.md](./GUINNESS-LEXICON.md) · [GUINNESS-00.md](./GUINNESS-00.md) · [PRODUCT-VISION.md](./PRODUCT-VISION.md)

---

## Two complementary ideas

| Idea | Value | Risk if done wrong |
|------|-------|-------------------|
| **Learn from language** | App feels alive; lexicon stays authentic; marketing writes itself | Creepy surveillance, privacy backlash, junk “insights” |
| **Share to social** | Organic growth; users show off domes; deep links back to app | API complexity, spam, alcohol marketing scrutiny |

Both support the north star: **find the best pour near you** — trends make the app a **source of truth**, sharing brings new users into the loop.

---

## Part 1 — Learning from pint language

### What data you already have (or will have)

| Source | Structured? | Trend potential |
|--------|-------------|-----------------|
| **Tags** (`great_dome`, `draught_00`, …) | Yes | ★★★★★ — best signal |
| **Scores** (overall + sub-scores) | Yes | ★★★★☆ — “0.0 similarity rising in Cork” |
| **Captions** (optional comment on Add Pint) | Semi-free text | ★★★☆☆ — mine pub phrases |
| **Product + serving** | Yes | ★★★★★ — “Draught 0.0 up 40% this month” |
| **Location** (city / coords) | Yes | ★★★★☆ — regional trends |

**Insight:** Curated **tags** are your primary language layer. Free-text captions supplement; don’t rely on NLP alone at small scale.

### What you can publish as “trends”

Examples that feel native to Guinness culture:

- **“☁️ Great Dome”** — most-used tag this week in Dublin
- **Draught 0.0** — fastest-growing product+serving combo in Ireland (last 30 days)
- **“Close to the real thing”** — tagged 23 times on 0.0 pours this month
- **Rising pub** — Murphy’s Bar: 4 new 8+ ratings this week
- **Regional** — Donegal avg Guinness draught score 8.1 vs national 7.4 (needs volume)

Surface in-app as:

- **Trends** tab or weekly card on feed (“This week in pours”)
- Push notification (opt-in): “Draught 0.0 ratings up near you”
- External: Instagram carousel, blog, “NicePints Index” (later)

### Lexicon flywheel

```
Users pick tags + write captions
        ↓
Aggregate tag/caption frequency (weekly job)
        ↓
Propose new tags for lexicon (human review)
        ↓
Ship new tags → users adopt → richer trends
```

Crowd-coined phrases (“fake Guinness”, “missing the bite”) become **candidate tags** after moderation — the app learns Irish pub language from real posts, not a dictionary in a vacuum.

### Caption mining (lightweight v1)

No LLM required at first:

1. Tokenize captions (lowercase, strip punctuation)
2. Match against **known lexicon terms** (from GUINNESS-LEXICON + GUINNESS-00)
3. Count unknown n-grams that appear ≥ N times → “emerging phrase” queue
4. Human approves → new tag or marketing copy

**v2:** Optional LLM batch job (Supabase Edge Function + cron) to cluster themes — only when you have thousands of captions.

### Architecture sketch

```
pint_tags          → daily rollup → tag_trends(city, tag, count, period)
pints.caption      → weekly scan  → phrase_candidates(phrase, count, status)
pints + products   → daily rollup → product_serving_trends(city, product, serving, count, avg_score)

trend_snapshots    → precomputed for feed “This week” card (fast reads)
```

- **Rollups:** Supabase cron + SQL or Edge Function; don’t compute trends on every page load.
- **Privacy:** Aggregate only in public trends; never expose “User X said Y” in trend UI.
- **GDPR:** Mention in privacy policy that captions/tags used for aggregated stats.

### What not to do

- Don’t show “AI summary of what people think” with tiny sample sizes (misleading).
- Don’t auto-post user quotes without consent.
- Don’t sell trend data to pubs in v1 (conflicts with trust).

---

## Part 2 — Social media integration

### What users actually want

- Show off a **serious dome** or **0.0 on draught** photo
- Credit the pub / score
- Optional: bring friends back into NicePints

They do **not** need full in-app Instagram/TikTok clones.

### Recommended approach: native share sheet first

**v1 — Capacitor Share API** (`@capacitor/share`)

- After posting a pint (or from pint detail): **“Share pour”**
- Shares: image + short text + deep link

Example share payload:

```
Serious pint. 9.2/10 Guinness 0.0 on draught at O'Donoghue's.
☁️ Great Dome · 🎯 Close to the Real Thing
https://nicepints.app/pint/abc123
```

User picks Instagram, WhatsApp, Messages, X — **no OAuth, no Meta API approval**.

| Pros | Cons |
|------|------|
| Ships in days | No auto-post to feed |
| Works on iOS + Android | No read-back of likes from Instagram |
| App Store friendly | User leaves app (fine) |

### v2 — Branded share card (image generation)

Generate a **single image** for sharing (canvas or server-side):

- Pint photo
- Score + product + pub name
- Small NicePints wordmark
- Optional QR / link

People post the **card** to Stories — better marketing than a raw photo.

Tech: client-side canvas in Add Pint success screen, or Supabase Edge Function that composites image.

### v3 — Deep linking

- `nicepints.app/pint/:id` → web fallback or app open (Universal Links / App Links)
- Shared links drive installs + pint detail views

Capacitor: `@capacitor/app` URL listeners + associated domains on iOS.

### What to avoid (for now)

| Approach | Why defer |
|----------|-----------|
| **Instagram Graph API** posting | Business account, app review, token hell |
| **Auto-cross-post every pint** | Spammy; alcohol optics; user consent |
| **Import followers / social graph** | Scope creep; privacy |
| **OAuth “connect Instagram”** | Maintenance; limited API for consumer apps |

### Optional later: link social **identity** (not auto-post)

- “Add Instagram handle to profile” (display only, `@sean_d`)
- Verify optional — not required for v1
- Helps discovery (“pints by @handle”) without API integration

### Alcohol / App Store notes for sharing

- User-initiated share only (no nudging “share every pint”)
- Responsible drinking line on share sheet footer
- Report flow for inappropriate shared content in-app
- Don’t incentivize drinking (no “share 5 pints for a badge”)

---

## How trends + social work together

```
User logs pint + tags + photo
        ↓
   Share to Instagram (optional)
        ↓
Friends tap link → install / view pint
        ↓
More pints → richer trends → “Draught 0.0 trending in your area”
        ↓
Push / feed card → re-engagement
```

Trends give **reason to open the app** between pub visits.  
Sharing brings **new users** who care about the same niche (0.0 on draught).

---

## Phased build plan

### Phase 5a — Share (quick win)

- [ ] “Share pour” on pint detail + post-success screen
- [ ] `@capacitor/share` with image URL + text + link
- [ ] Copy tuned from lexicon (“Serious pint”, not “Great review!”)

### Phase 5b — Trends v1 (structured data only)

- [ ] Tag frequency rollup (city + national, 7d / 30d)
- [ ] Product+serving trend (“Draught 0.0 posts this week”)
- [ ] “This week in pours” card on feed (3–5 bullets max)
- [ ] Privacy policy line on aggregated analytics

### Phase 6 — Share card + deep links

- [ ] Branded share image generation
- [ ] Universal Links / `nicepints.app/pint/:id`
- [ ] Track share button taps (analytics only)

### Phase 7 — Language intelligence

- [ ] Caption → lexicon term matching
- [ ] Emerging phrase candidate queue (admin review)
- [ ] Optional: propose new tags from crowd language
- [ ] External “NicePints trend” post (manual or scheduled)

---

## Open questions

| Question | Options | Decision |
|----------|---------|----------|
| Public trends by city only, or pub-level? | City · Pub · Both | TBD — city first (privacy) |
| Show trend card on home feed? | Yes · Separate Trends tab | TBD |
| Share includes user handle? | Yes · Anonymous option | TBD — default @display_name |
| LLM for caption clustering? | Never · v2+ | TBD — defer until volume |

---

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-06 | Native share sheet before social APIs | Fast, works, App Store safe |
| 2025-06 | Tags primary signal for trends; captions secondary | Structured > NLP at small scale |
| 2025-06 | Aggregates only in public trends | Privacy + trust |
