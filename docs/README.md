# NicePints — Product & Architecture Docs

Living documents for product thinking, terminology, and build priorities. Update these as the app evolves.

| Doc | What it covers |
|-----|----------------|
| [PRODUCT-VISION.md](./PRODUCT-VISION.md) | North star, killer feature, trust, discovery, App Store positioning |
| [DESIGN-PRINCIPLES.md](./DESIGN-PRINCIPLES.md) | **Rams/Braun design principles** — clarity, restraint, “the pint is the product” |
| [GUINNESS-LEXICON.md](./GUINNESS-LEXICON.md) | Draught Guinness vocabulary, tags, Dome Score, copy tone |
| [GUINNESS-00.md](./GUINNESS-00.md) | **Guinness 0.0 deep dive** — terms, judging criteria, 0.0 tags, Find 0.0 on Draught filter |
| [SOCIAL-AND-TRENDS.md](./SOCIAL-AND-TRENDS.md) | Language/trends from tags & captions, social sharing strategy |
| [ROADMAP.md](./ROADMAP.md) | Phased build plan, data model sketch, open decisions |
| [QA-NOTES.md](./QA-NOTES.md) | Bug history and fix status |
| [QA-TEST-PLAN.md](./QA-TEST-PLAN.md) | **Functional spec + manual test checklist + test log** |
| [SUPABASE-AUTH.md](./SUPABASE-AUTH.md) | **Sign-in troubleshooting** — OTP, magic links, dashboard settings |

## How to use these

1. **Before building a feature** — check ROADMAP phase, PRODUCT-VISION intent, and DESIGN-PRINCIPLES feature filter.
2. **When designing UI copy** — use [GUINNESS-LEXICON.md](./GUINNESS-LEXICON.md) and [DESIGN-PRINCIPLES.md](./DESIGN-PRINCIPLES.md).
3. **When schema changes** — update ROADMAP architecture section and note decisions inline.
4. **After shipping** — tick items in ROADMAP and add learnings under “Decisions log”.

## Current app (technical baseline)

- React + TypeScript + Vite + Tailwind + Supabase + Capacitor (iOS/Android)
- Auth: email OTP + display name
- Core loop: log pint (1–10) at pub → feed + find a pour + profile
- Discovery: Guinness 0.0, serving type, Find a Pour presets
- QA: manual passes recorded in [QA-TEST-PLAN.md](./QA-TEST-PLAN.md)

See [ROADMAP.md](./ROADMAP.md) for where we’re headed.
