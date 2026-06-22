# Nice Pints — Developer Handoff (Cursor / Claude Code)

This is a **design system**, not a throwaway mockup. Much of it is directly usable code; the rest is a faithful reference to recreate in your stack. Hand this whole folder to Cursor and point it at this file first.

---

## What's directly usable (copy as-is)

| What | Where | Notes |
|---|---|---|
| **Design tokens** | `styles.css` → `tokens/*.css` | Real CSS custom properties. Link `styles.css` and you have the whole system: colours, type, spacing, radii, shadows, motion. **Ship these as-is.** |
| **Webfonts** | `tokens/fonts.css` | Playfair Display, DM Sans, Inter via Google Fonts CDN. No binaries to host. |
| **Brand assets** | `assets/brand/` | The pint mark (`pint-silhouette.svg`), app icon (`icon.svg`), favicons, PNGs. Production-ready SVG/PNG. |
| **React primitives** | `components/**/<Name>.jsx` | `Button`, `Card`, `Input`, `Tag`, `SectionLabel`, `BrandWordmark`/`PintMark`, `EditorialRatingBlock`, `RatingScore`, `DrinkChip`, `NavBar`. Plain React + CSS vars, **zero npm deps**. Drop into any React app. Each has a `.d.ts` (TypeScript props) and a `.prompt.md` (usage). |

## What's a reference (recreate in your stack)

| What | Where | Notes |
|---|---|---|
| **App screens** | `ui_kits/app/` | Feed → Find a Pint → Pint detail, click-through. Built with inline-JSX + Babel for the browser — **read it for layout/behaviour, rebuild with the components above** using your router/state. |
| **Starter template** | `templates/nice-pints-app/` | The feed screen as a self-contained component reference. |

---

## Fidelity: **high.** Exact colours, type, spacing, and interactions are final. Recreate pixel-perfect.

## The non-negotiable brand rules (give these to Cursor verbatim)

1. **Warm-black, never pure `#000`.** Page `--stout #13110F`, cards `--graphite #1E1B17`, hover `--elevated #252119`, borders `--line #332D24`.
2. **One gold, used sparingly.** `--gold #C8A24B` only on the single primary action per screen, the active tab, and the italic "Pints". Never gold backgrounds or gold stat numbers.
3. **The score is the hero.** Big Playfair numeral (decimal as raised superscript) + a thin gold hairline rule + a one-word verdict. Always cream so it reads on any photo — the rule carries the gold. See `EditorialRatingBlock`.
4. **Photos lead; UI gets out of the way.** 4:5 portrait crops, light scrim (`rgba(19,17,15,0.35)` base + bottom gradient), subtle 4% noise. No heavy black boxes.
5. **Rating bands:** gold ≥9, amber ≥8, copper ≥7, stone <7. The only place colour encodes meaning.
6. **Drink accents** (Guinness cream, 0.0 slate, Beamish red, Murphy's plum) appear **only** as a 3px left border + text on the category chip. See `DrinkChip`.
7. **Pub voice, not SaaS.** "Find a pint", "logged by Ant" (no `@`), "a serious pint". Honest copy, no fake social proof, celebrate quality not quantity.
8. **Calm motion.** One staggered fade-up on the feed; press shrinks (`scale 0.96`); nothing loops. Respect `prefers-reduced-motion`.

## Quick start in a React codebase

```bash
# 1. Copy tokens + assets
cp -r tokens styles.css assets <your-app>/src/design-system/

# 2. Link the stylesheet once (root layout / index)
import './design-system/styles.css'

# 3. Copy the component(s) you need and use CSS vars for styling
```

```jsx
import { EditorialRatingBlock } from './design-system/components/brand/EditorialRatingBlock';
import { DrinkChip } from './design-system/components/brand/DrinkChip';

<EditorialRatingBlock score={9.4} size="hero" />
<DrinkChip slug="guinness">Guinness · Draught</DrinkChip>
```

Style anything new with the variables — `var(--gold)`, `var(--graphite)`, `var(--font-display)` — and you're inside the system.

## Read these next
- `readme.md` (root) — full brand guide: content voice, visual foundations, iconography, the logo critique.
- `SKILL.md` — this folder also works as a downloadable Claude Code / Cursor skill (drop it in and invoke it).
- Each component's `.prompt.md` — one-line "what & when" + usage example.

## Source of truth
Reverse-engineered from the live product: **github.com/WeeTonyCooke/nicepints** (`docs/`, `src/components/`, `src/index.css`, `tailwind.config.js`). Explore it for deeper fidelity.
