# Design Principles — NicePints

Rams/Braun-inspired principles for NicePints (and aligned projects like Festival). **Steer from here and Built for Mars** when evaluating UI, copy, and features.

Related: [PRODUCT-VISION.md](./PRODUCT-VISION.md) · [GUINNESS-LEXICON.md](./GUINNESS-LEXICON.md) · [ROADMAP.md](./ROADMAP.md)

---

## The ten principles

### 1. Clarity first

If a user has to think about what something does, the design has failed.

- Labels say what they mean: “Find a pint”, not “Discover experiences”.
- One primary action per screen.
- No mystery icons without context.

### 2. Restraint creates confidence

Don’t add features because you can. Add them because they make the product better.

- Say no to scope that doesn’t serve the pint.
- Ship fewer screens, done well.
- Defer social mechanics until discovery works.

### 3. Calm interfaces win

The interface should feel quiet and deliberate, not like it’s shouting for attention.

- Dark, restrained palette — see **Colour tokens** below.
- No autoplay, no flash, no notification spam.
- Motion only when it aids understanding.

### 4. Function determines form

Every visual element should have a purpose.

- Rating badge exists to communicate score at a glance.
- Photo is evidence, not decoration.
- Tags encode meaning; empty chrome does not.

### 5. Build systems, not pages

Create reusable patterns and components rather than designing each screen independently.

- Shared header, cards, load/error states, form fields.
- Product-aware rating forms extend one system.
- Tokens in Tailwind, not one-off styles per screen.

### 6. Let content provide the colour (with drink-type accents)

The photos, ratings, and pubs should be the stars. The UI mostly gets out of the way — with one exception: a small, consistent accent colour per drink type, used to make the feed scannable at a glance.

- Feed is photo-first.
- Pint photos carry the primary visual energy.
- Drink-type accent colour appears only on the category label/chip — never as a background gradient, card border glow, or anything that competes with the photo itself.
- One accent per drink type, used consistently everywhere that drink appears (see **Drink accents** under Colour tokens).

### 7. Honest design

Don’t exaggerate. Don’t manipulate. Don’t pretend something is more important than it is.

- “Top pint” not “Pint of the Day” if it doesn’t rotate daily.
- “Posted nearby” not “Verified in pub” without proof.
- Real scores, real photos — no fake social proof.

### 8. Mobile is primary

Design for the thumb first, desktop second.

- Safe areas, bottom nav, large tap targets.
- Capacitor/iOS is the reference device.
- Desktop is a nice-to-have wrapper around the same experience.

### 9. Typography is communication

Text isn’t decoration. The hierarchy should make the app understandable without effort.

- Display font for pub names and scores; system weight for UI.
- Uppercase tracking for section labels, not body copy.
- Pub language (“serious pint”) over SaaS language (“submit review”).

### 10. Remove until it feels inevitable

Keep removing things until what’s left feels like it couldn’t be any other way.

- Cut legacy pages, unused deps, redundant scores.
- If a screen needs a tutorial, simplify the screen.
- Every element should earn its place.

---

## 11. The pint is the product

**Not the app. Not the social network. Not the badges. Not the gamification. The pint.**

Every screen should answer one of these questions:

| Question | Example feature |
|----------|-----------------|
| Where can I find a good pint? | Guinness 0.0 on draught filter |
| Is this pint worth ordering? | Score + photo + tags on detail |
| Is this pub worth visiting? | Pub breakdown by product + serving |
| Should I make a journey for this? | “Worth the Trip” tag, distance, recency |

If a feature doesn’t help answer one of these, defer it.

---

## Feature filter

Use when evaluating roadmap items, QA suggestions, or new ideas.

### Fits the philosophy

| Feature | Why |
|---------|-----|
| Guinness 0.0 on draught filter | Answers “where can I find a good pint?” |
| Dome score | Honest, culture-native quality signal |
| Recent verified photos | Evidence, not opinion alone |
| Best pints near me | Core discovery |
| “Worth the Trip” tag | Journey-worthiness |
| Request a pub | Removes dead ends without bloat |
| Native share sheet | One tap to show off a pour — user-initiated |
| Tag trends (aggregated) | Pub culture signal, not engagement bait |

### Doesn’t fit the philosophy

| Feature | Why |
|---------|-----|
| Virtual coins | Gamification distraction |
| Streaks | Nudges volume, not quality |
| Animated badges everywhere | Noise over content |
| TikTok-style endless feed | Engagement mechanics over utility |
| Following 10,000 people | Social network scope creep |
| Auto-post to Instagram | Pushy, not calm |
| Leaderboards for “most pints logged” | Encourages quantity over quality |

When in doubt: **would Dieter Rams log a pint here, or would he leave?**

---

## Colour tokens

Warm-black system in `tailwind.config.js` + CSS variables in `index.css`. **Gold is seasoning, not gravy.**

| Token | Hex | Role |
|-------|-----|------|
| **stout** (`--bg`) | `#13110F` | Page background — warm black, not pure #000 |
| **graphite** (`--surface`) | `#1E1B17` | Cards, inputs, nav pill |
| **elevated** (`--surface-alt`) | `#252119` | Hover / avatar / elevated states |
| **line** (`--border`) | `#332D24` | 1px card borders — separates surface from bg |
| **cream** (`--text-primary`) | `#F3EFE6` | Body text, stat values (non-rating) |
| **muted** | `#8C8579` | Labels, secondary copy, inactive nav |
| **gold** | `#C9A227` | Primary CTAs, active tab, “Pints” in wordmark only |
| **gold-soft** | `#3A301A` | Active filter pill background |
| **sage** | `#7A9B76` | Ratings ≥ 7.0 |
| **rust** | `#B8634A` | Ratings &lt; 5.0, delete/error |

**Drink accents** (label/chip left border + text only — via `drinkAccent.ts`):

| Slug | Hex | Drink |
|------|-----|-------|
| `guinness` | `#F3EFE6` (cream) | Guinness |
| `guinness-00` | `#6B8FA8` | Guinness 0.0 |
| `beamish` | `#B85C5C` | Beamish |
| `murphys` | `#8F4A62` | Murphy's |
| *(other)* | `#8C8579` (muted) | Fallback |

### Usage rules

- **Gold** — primary buttons (`Post Pint`, `Use photo`), active nav, italic “Pints” in wordmark. Nowhere else.
- **Ratings** — sage / rust / cream via `RatingScore` and `ratingColor.ts` (7+ / &lt;5 / neutral). On feed and pint detail, score is the largest text element (bare numeral, no `/10` at dominant sizes).
- **Drink labels** — `DrinkLabelChip` with 3px left border in drink accent; never on photo scrims or score pills.
- **Cards** — `bg-graphite border border-line` so surfaces lift off the page.
- **Serif (`font-display`)** — wordmark + screen H1s only. All other UI is sans (`DM Sans`).
- **Photo overlays** — `.photo-scrim-base` + `.photo-scrim-gradient` on photo cards; kept lighter so photos carry energy — gradient weighted to the bottom text area.

Avoid bright lobby gold (`#D4AF37`) and gold stat numbers.

---

## Identity (Built for Mars)

NicePints is a **utility app for finding and logging pints**, not a social network. Identity should support attribution without importing Twitter/Instagram patterns.

### Do

| Pattern | Why |
|---------|-----|
| **Name on pints** — plain text, no `@` prefix | Attribution, not handles |
| **One-time name prompt** after first sign-in | User chooses how they appear |
| **Email in Settings only** | Sign-in credential, not public profile |
| **Rename updates all pints** | One identity, consistent feed |
| **Real name or nickname** | User's choice — no forced handles |

### Don't

| Pattern | Why |
|---------|-----|
| `@mentions` | Social graph scope creep |
| Public profile pages | We're not a network |
| Followers / following | Engagement mechanics over utility |
| Email in profile header | Privacy + wrong mental model |

**Copy rule:** Say "logged by Ant", not "@Ant". Say "Name on pints", not "Display name" or "handle".

---

## Product shorthand

A Rams-style NicePints should feel almost boring compared with modern social apps:

```
Open app → See pints → Find pub → Rate pint → Leave.
```

That’s a strength, not a weakness.

**One-line positioning:**

> **Google Maps for Guinness drinkers.**

Clear. Calm. Purposeful. The pint is the product.

---

## Applying principles in code & UI

| Principle | Current codebase alignment |
|-----------|---------------------------|
| Clarity first | LoadError + retry; explicit sign-in steps |
| Restraint | Legacy JSX removed; no leaflet/social bloat |
| Calm | Dark theme, minimal nav (5 tabs) |
| Content = colour | Photo required on new posts (Phase 1) |
| Honest | /10 scale; “Top pint” rename; posted-nearby (planned) |
| Mobile primary | Capacitor, safe-area CSS, native camera |
| Typography | Lexicon-driven copy (“serious pint”) |
| The pint is the product | Roadmap leads with Find 0.0 on draught |

### Review checklist (before shipping a feature)

1. Does it answer one of the four pint questions?
2. Can we remove anything and still ship it?
3. Does the UI stay quieter than the photos?
4. Are we honest about what we claim?
5. Is mobile the first-class experience?

---

## Decisions log

| Date | Decision | Principle |
|------|----------|-----------|
| 2025-06 | Adopt Rams/Braun 10 + “Pint is the product” | Guides NicePints + Festival alignment |
| 2025-06 | No streaks/gamification in roadmap | Restraint + honest design |
| 2025-06 | Discovery over social graph | #11 — Google Maps for Guinness drinkers |
| 2025-06 | BFM identity: no @, email in settings, name prompt | Identity section — utility not social |
| 2026-06 | Drink-type accent colours on category labels only; amends #6 | Visual hierarchy / scannability over strict chrome-neutrality |
