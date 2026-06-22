---
name: nicepints-design
description: Use this skill to generate well-branded interfaces and assets for Nice Pints, the "Michelin Guide for pints" Irish pub-and-pint discovery app, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colours, type, fonts, brand assets, and UI kit components for prototyping a calm, warm-black, photo-first, Rams-disciplined product.
user-invocable: true
---

Read the `readme.md` file within this skill first — it carries the brand context, the logo critique, content fundamentals (pub voice, not SaaS), visual foundations (warm-black surfaces, "gold is seasoning", the editorial score, drink accents), and iconography (Lucide + the bespoke pint mark). Then explore the other available files:

- `styles.css` + `tokens/*.css` — the design tokens. Link `styles.css` and style with the CSS custom properties (`var(--gold)`, `var(--graphite)`, `var(--font-display)`).
- `components/**` — reusable React primitives (`Button`, `EditorialRatingBlock`, `RatingScore`, `DrinkChip`, `BrandWordmark`/`PintMark`, `NavBar`, `Card`, `Input`, `Tag`, `SectionLabel`). Each has a `.prompt.md` with usage.
- `ui_kits/app/` — the full mobile app recreation (Feed → Find a Pint → Pint detail). Copy its `primitives.jsx` / `screens.jsx` patterns to build new screens in-brand.
- `assets/brand/` and `assets/photos/` — the pint mark, app icon, favicons, and real pint photography.
- `guidelines/cards/*.html` — specimen cards if you want to see tokens rendered.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and apply the rules here to design as an in-house Nice Pints designer would.

If the user invokes this skill without other guidance, ask them what they want to build or design, ask a few focused questions, and act as an expert hospitality-brand designer who outputs HTML artifacts _or_ production code, depending on the need.

**Non-negotiables when designing for Nice Pints:** warm-black, never pure `#000`. Gold only on the one primary action per screen. Photos are the hero; the UI gets out of the way. Pub voice, not SaaS voice ("a serious pint", "logged by Ant", never "@Ant"). Honest copy — no fake social proof. Drink accents only on category chips. Celebrate quality, never quantity.
