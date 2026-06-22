# Nice Pints — Design System

> **The Michelin Guide for pints.** Find the best Guinness near you, with recent photos to prove it. A calm, editorial, photo-first utility — not a craft-beer social network.

Nice Pints is an Irish pub-and-pint discovery app. You search for a drink (Guinness, Guinness 0.0, Beamish, Murphy's), pick a serving (draught vs can), and the app surfaces the best-rated pours nearby, each backed by a recent user photo. The product thesis: a rating is not "this pub is 4.2 stars" — it is **pub + product + serving, scored over time, weighted for freshness.**

This design system is the warm-black, Rams-disciplined visual language behind that product. **Trust, quality and simplicity over craft-beer culture.**

---

## Sources

This system was reverse-engineered from the live product and its design docs. If you have access, explore them for deeper fidelity:

- **GitHub — `WeeTonyCooke/nicepints`** · https://github.com/WeeTonyCooke/nicepints
  - `docs/DESIGN-PRINCIPLES.md` — the ten Rams/Braun principles + "the pint is the product"
  - `docs/PRODUCT-VISION.md` — the north-star query, honest "verified" badges, rating model
  - `docs/GUINNESS-LEXICON.md` / `docs/GUINNESS-00.md` — authentic pub vocabulary for copy & tags
  - `tailwind.config.js` + `src/index.css` — the colour tokens this system mirrors exactly
  - `src/components/`, `src/pages/` — the real React components the UI kit recreates
- **Related repo** — `WeeTonyCooke/movillefestival` (aligned project, same principles)

Original brand assets (wordmark, pint mark, app icon, favicons, pub photos) were imported from the repo's `public/` and `src/assets/` into `assets/`.

---

## Logo critique (the brief asked for it — brutally)

The existing logo direction (pint-glass mark + "Nice *Pints*" wordmark) is **already strong and on-brand** — keep it. But the brutal notes:

1. **The mark dies on dark backgrounds.** The glass body is `#0A0A0A` (near-black), so on the warm-black app it reads as *a floating cream lozenge on a white hair* — the iconic pint silhouette disappears. At header size it looks like a thumbtack, not a pint. **Fix:** give the body a hair more lift than the page (`graphite`, not pure black) OR rely on the white settle-line to carry the outline. As-is it only works on pure `#0A0A0A`.
2. **Two blacks, now named by role (resolved).** The system uses `#0A0A0A` for the *icon/favicon tile* (`--np-black`) and the warm `#13110F` for the *app surface* (`--stout`). These are deliberately distinct — the icon tile reads as true black so the cream glass pops, the app stays warm — and are now documented as two roles, not one fuzzy value.
3. **One gold (resolved).** Unified on `#C8A24B` (the warmer brand gold). `--gold` now aliases `--np-gold`, so wordmark, CTAs, active states and the editorial rule all draw from a single source of truth. The old `#C9A227` interactive gold is retired.
4. **The wordmark is the strongest asset.** Playfair black with "Pints" set gold italic is genuinely premium and Michelin-adjacent — far better than the mark. Lead with the wordmark; treat the pint mark as a supporting lockup element, not the hero.
5. **Pint mark has no base line "for cleanliness"** — correct call, it *is* more iconic. But without a base it can read as a lightbulb/balloon at tiny favicon sizes. Test at 16px.

**Verdict:** wordmark = keep and celebrate. Mark = **redrawn** to a true Guinness tulip (flared rim, neck, belly, flat base) traced from the reference, with a cream outline + cream head so it stays legible on dark — the black-on-black failure is solved. Palette and type are excellent; the two-blacks and two-golds notes are now **resolved** (one gold `#C8A24B`; the two blacks kept but named by role).

---

## Content fundamentals

**Voice: the pub, not the SaaS.** Copy should sound like a knowledgeable regional who knows their pour — warm, dry, understated. Never marketing-shouty, never gamified.

- **Pub language over product language.** "Find a pint", not "Discover experiences". "Log a pint", not "Submit a review". "A serious pint", not "Excellent rating".
- **Honest by default (Rams #7).** "Top pint" only if it doesn't rotate. "Posted nearby" only with real location. Never "Verified in pub" without proof. No fake social proof.
- **Authentic Guinness lexicon** for tags and praise — *dome, creamer, settle, lacing, two-part pour, a lovely drop, a cracking pint, worth the trip, split the G*. Negatives are just as vivid: *flat, loose head, short pour, dead pint, dirty glass*.
- **Identity, not handles.** "logged by Ant" — plain text, **no `@` prefix**, no followers, no public profiles. Attribution, not a social graph.
- **Casing.** Sentence case for body and buttons. UPPERCASE + wide tracking only for small section labels and chips (`LATEST`, `GUINNESS · DRAUGHT`). Never uppercase body copy.
- **"You", not "we".** Address the drinker directly: "we'll show you the best-rated places nearby."
- **Responsible drinking.** Celebrate *quality, never quantity*. No "drink more" language, no streaks, no leaderboards for "most pints logged". Age-gated 17+.
- **Emoji:** used sparingly and only functionally — country **flags** on feed/detail meta rows (🇮🇪 🇺🇸) and the optional tag glyphs (☁️ Great Dome, 🍀 Worth the Trip). Never decorative emoji in headings or body.

**Microcopy examples (real):** "Find a great pint near you." · "Choose a drink and we'll show you the best-rated places nearby." · "Pouring pints…" (loading) · "logged by Niamh" · "12 pints logged · 4 this month".

---

## Visual foundations

**Mood:** quiet, dark, editorial, premium. The opposite of a busy social feed. Think a dimly-lit snug and a Michelin guide, not Untappd.

- **Colour.** A **warm-black** surface system — `stout #13110F` page, `graphite #1E1B17` cards, `elevated #252119` hover, `line #332D24` 1px borders. Text is `cream #F3EFE6` and `muted #8C8579`. **Gold is seasoning, not gravy** — `gold #C9A227` appears only on the one primary action per screen, the active tab, and the italic "Pints". Never gold backgrounds, never gold stat numbers.
- **Rating colour.** Scores get a four-band warm ramp — **gold ≥9 (exceptional), amber ≥8 (excellent), copper ≥7 (very good), stone <7**. This is the only place colour encodes meaning at scale.
- **Drink accents.** One accent colour per drink type — Guinness cream, 0.0 slate `#6B8FA8`, Beamish red `#B85C5C`, Murphy's plum `#8F4A62` — used **only** as a 3px left border + text on the category chip. Never as a background, glow, or scrim. It exists purely to make the feed scannable by drink.
- **Type.** **Playfair Display** (900 black, tracking −0.03em) for the wordmark, screen H1s, pub names and scores — high-contrast serif doing the brand voice. **DM Sans** is the UI workhorse (400–700) for body, labels, nav. **Inter** for tabular numerics. Section labels are 11px uppercase, 0.12em tracking.
- **The signature score.** The largest element on any feed/hero card is the **editorial rating block**: a big Playfair numeral with the decimal as a raised superscript, a thin **gold hairline rule** beneath, and a one-word verdict. Always cream (so it reads on any photo); the rule carries the gold.
- **Imagery is the hero.** Pints photos are warm, real, user-shot — slightly moody, never stocky. Feed and hero use a **4:5 portrait** crop. The UI gets out of the way (Rams #6) so the pour carries the energy.
- **Photo scrims are light.** A `rgba(19,17,15,0.35)` base wash plus a bottom-weighted gradient (`0.78 → 0.08`) — just enough for text legibility, never a heavy black box. A subtle **noise overlay** (4% opacity, overlay blend) warms the dark surfaces and photo edges.
- **Backgrounds:** flat warm-black. **No gradients-as-decoration, no patterns, no illustrations.** The only gradient is the functional photo scrim and the nav fade.
- **Cards:** `graphite` fill, **1px `line` border** (this is what lifts a surface off the page — not shadow alone), soft low shadow (`0 8px 24px rgba(0,0,0,.35)`). Radii: **16px** photo cards, **24px** sheets, **4px** drink chips, **pill** for nav/CTAs/presets, **8px** inputs.
- **Motion:** calm and purposeful (Rams #3). Feed cards do a single staggered fade-up on load (0.4s, `cubic-bezier(.4,0,.2,1)`); nothing loops, nothing autoplays. Respect `prefers-reduced-motion`.
- **Hover/press:** hover shifts colour (muted→cream, or to gold on nav). Press **shrinks**: buttons `scale(0.96)`, cards `scale(0.985)`, the add-FAB `scale(0.90)`. No bounce.
- **Transparency & blur:** the floating nav pill is `graphite/95` with `backdrop-blur(16px)`; the rating pill over photos is `black/55` with `blur(4px)`. Blur is reserved for elements floating over content.
- **Layout:** mobile-first, single max-width **~430px** column. Bottom nav is a fixed floating pill with a raised gold "+". Generous tap targets (44px min). Safe-area aware.

---

## Iconography

- **Lucide** (stroke icons, `react-lucide`) is the app's icon set — 2px stroke, round caps/joins. Feed = Activity, Find = MapPin, Profile = User, add = Plus, back = ChevronLeft, search = Search, location = Navigation. This system **inlines** Lucide-equivalent SVG paths in `NavBar` and the UI kit so no icon dependency is required; when building production UI, use `lucide-react` directly for the full set.
- **The pint mark** is the one bespoke icon — a hand-tuned Guinness-glass silhouette (cream head, warm-black body, white settle line, no base line). Shipped as `assets/brand/pint-silhouette.svg` (mark only) and `assets/brand/icon.svg` (mark on a black app-icon tile). It's also inlined in the `PintMark` / `BrandWordmark` components so it needs no asset path.
- **Emoji** are used only as **country flags** in meta rows and optionally as tag glyphs (☁️ 🥛 🍀). Never as UI icons or decoration.
- **No emoji cards, no bespoke illustration, no decorative SVG.** If an icon isn't Lucide or the pint mark, it probably doesn't belong.

---

## Index — what's in here

**Foundations**
- `styles.css` — the single entry point (consumers link this). `@import`s everything below.
- `tokens/colors.css` — warm-black surfaces, text, gold, rating bands, drink accents, status.
- `tokens/typography.css` — families, type scale, weights, leading, tracking.
- `tokens/spacing.css` — 4px spacing scale, radii, shadows, motion, press scales.
- `tokens/effects.css` — noise overlay, photo scrims, feed fade-up animation.
- `tokens/fonts.css` — Playfair Display / DM Sans / Inter via Google Fonts.
- `guidelines/cards/*.html` — foundation specimen cards (Colors, Type, Spacing, Brand) shown in the Design System tab.

**Components** (`window.DesignSystem_572a4a.<Name>`)
- `components/core/` — `Button`, `Card`, `Input`, `SectionLabel`, `Tag`
- `components/brand/` — `BrandWordmark` (+ `PintMark`), `EditorialRatingBlock`, `RatingScore` (+ `ratingTone`), `DrinkChip`
- `components/navigation/` — `NavBar` (+ `NavIcons`)
- Each has a `.d.ts` (props), `.prompt.md` (usage), and a directory `*.card.html` thumbnail.

**UI kit**
- `ui_kits/app/` — the Nice Pints mobile app, click-through: **Feed → Find a Pint → Pint detail** with the floating bottom nav. `index.html` (shell) + `primitives.jsx` + `screens.jsx` + `data.js`.

**Assets** (`assets/`)
- `brand/` — pint silhouette, app icon, favicons, hero, wordmark marks.
- `photos/` — real pint photos from Dublin, Skerries, Moville, Boston for feed/kit use.

**Skill**
- `SKILL.md` — makes this folder usable as a downloadable Claude/Claude Code skill.

---

## Quick start

```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script>
  const { Button, EditorialRatingBlock, DrinkChip } = window.DesignSystem_572a4a;
</script>
```

Everything reads from CSS custom properties — style with `var(--gold)`, `var(--graphite)`, `var(--font-display)` and you're inside the system.
