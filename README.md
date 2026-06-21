# NicePints

Find the best pint near you — Guinness, Guinness 0.0, and more — with recent photos to prove it.

Mobile-first React app (Vite + TypeScript + Tailwind + Supabase + Capacitor for iOS/Android).

## Product docs

**Start here for vision, terminology, and build plan:**

- [docs/README.md](./docs/README.md) — index
- [PRODUCT-VISION.md](./docs/PRODUCT-VISION.md) — killer feature, discovery, App Store
- [DESIGN-PRINCIPLES.md](./docs/DESIGN-PRINCIPLES.md) — Rams/Braun principles, feature filter
- [GUINNESS-LEXICON.md](./docs/GUINNESS-LEXICON.md) — draught Guinness vocabulary, tags, Dome Score
- [GUINNESS-00.md](./docs/GUINNESS-00.md) — **Guinness 0.0** terms, judging, Find 0.0 on Draught
- [SOCIAL-AND-TRENDS.md](./docs/SOCIAL-AND-TRENDS.md) — trends from tags/captions, social sharing
- [ROADMAP.md](./docs/ROADMAP.md) — phases + scalable data model
- [drink-discovery-architecture-v1.0.md](./docs/drink-discovery-architecture-v1.0.md) — product-driven drinks + discovery
- [PROFILE-TRUST-SIGNAL-SPEC.md](./docs/PROFILE-TRUST-SIGNAL-SPEC.md) — consensus trust signal + favourites
- [FOUNDING-TASTER-SPEC.md](./docs/FOUNDING-TASTER-SPEC.md) — invite-only Founding Taster badge (pre-launch)
- [QA-NOTES.md](./docs/QA-NOTES.md) — QA history and open items

## Development

```bash
cp .env.example .env   # add Supabase URL + anon key
npm install
npm run dev
```

```bash
npm run typecheck
npm run build
npm run cap:ios        # requires Xcode + built web assets
npm run test:e2e       # Playwright smoke (maps to QA-TEST-PLAN)
```

Deploy: see [docs/DEPLOY.md](docs/DEPLOY.md) — Netlify Git connect + optional CI-gated build hook.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key |

Never commit `.env` — it is gitignored.

## Stack

- **Web:** React 18, TypeScript, Vite 5, Tailwind 3, React Router
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Mobile:** Capacitor 8 (camera, geolocation, status bar)
