# Deploy & automation

What runs automatically, what stays manual, and how to turn on production deploys safely.

Related: [QA-TEST-PLAN.md](./QA-TEST-PLAN.md) · [SUPABASE-AUTH.md](./SUPABASE-AUTH.md)

---

## What runs automatically today

| Trigger | What happens |
|---------|----------------|
| Push / PR to `main` | **CI** — migration verify, typecheck, build, Playwright smoke |
| Push to `main` (artifact) | `dist/` saved 14 days on GitHub Actions |
| Weekly (Dependabot) | PRs for npm + GitHub Actions updates |
| Netlify (if linked) | Build + publish on push to `main` |

**Never automated (by design):**

- Supabase SQL migrations — run manually in SQL Editor
- iOS App Store builds — Xcode locally
- Destructive DB operations
- Committing `.env` or secrets

---

## Safe automation map

```
Push to main
    │
    ├─► GitHub Actions CI (always)
    │       ├─ verify migrations exist
    │       ├─ typecheck + build
    │       └─ Playwright smoke (mocked Supabase)
    │
    ├─► Netlify Git deploy (if repo connected) — uses netlify.toml
    │
    └─► Netlify build hook (optional) — only if ENABLE_NETLIFY_DEPLOY=true
```

---

## 1. Netlify — recommended (safest deploy)

### Option A: Git integration (easiest)

1. [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git** → `WeeTonyCooke/nicepints`
2. Build settings are read from `netlify.toml` automatically
3. **Site configuration → Environment variables** — add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_PLACES_API_KEY` (or `GOOGLE_PLACES_API_KEY`) — pub search on Add Pint
4. **Domain management** — note your URL (e.g. `https://nicepints.netlify.app`)

### Google Places (pub search)

Production calls Places through **Netlify Functions** (`/.netlify/functions/places-*`) so the API key is not sent from the browser and HTTP referrer restrictions do not block requests.

In [Google Cloud Console](https://console.cloud.google.com/google/maps-apis):

1. Enable **Places API (New)**
2. Create an API key restricted to **Places API (New)** only
3. Application restriction: **None** (server-side via Netlify functions) — do **not** use HTTP referrer restriction on this key
4. Add the key to Netlify env as `VITE_GOOGLE_PLACES_API_KEY` (functions read this or `GOOGLE_PLACES_API_KEY`)

Local dev (`npm run dev`) still calls Google directly — add `http://localhost:3000/*` to referrer restrictions **only if** you use a separate browser-restricted dev key.

If pub search fails, Add Pint still works via **Add manually**; the UI shows a warning when Google is misconfigured.

### Supabase auth redirects

In Supabase → **Authentication → URL Configuration**, add:

- Site URL: your Netlify URL
- Redirect URLs: `https://your-site.netlify.app/**` and `http://localhost:3000/**`

### Option B: Build hook (CI-gated deploy)

Use this if you want deploy **only after CI passes** (not parallel with CI).

1. Netlify → **Site configuration → Build & deploy → Build hooks** → Create hook
2. GitHub repo → **Settings → Secrets and variables → Actions**:
   - **Secret:** `NETLIFY_BUILD_HOOK` = hook URL
   - **Variable:** `ENABLE_NETLIFY_DEPLOY` = `true`
3. GitHub → **Settings → Environments → production** (optional approval gate)

If `ENABLE_NETLIFY_DEPLOY` is not `true`, the deploy job is skipped — CI still runs.

**Do not enable both Option A and B** unless you want two builds per push. Pick one.

---

## 2. Supabase migrations (manual, intentional)

Migrations live in `supabase/migrations/`. CI only checks files are non-empty.

**Apply in Supabase SQL Editor** when ready:

1. `20250617000000_phase1_moderation.sql`
2. `20250619000000_pint_rename_policy.sql`
3. `20250621000000_pint_user_id_ownership.sql`
4. `20250622000000_phase2_discovery.sql`

We do **not** auto-run these — one bad migration against production is worse than a manual step.

---

## 3. GitHub secrets (optional, later)

| Secret | When to add | Risk if leaked |
|--------|-------------|----------------|
| `NETLIFY_BUILD_HOOK` | Option B deploy | Triggers rebuilds only |
| `VITE_SUPABASE_URL` | Staging E2E (future) | Low — public project URL |
| `VITE_SUPABASE_ANON_KEY` | Staging E2E (future) | Low — anon key is client-side; use **staging** project only |

**Never add:** Supabase service role key, Resend API key, Apple certificates.

---

## 4. iOS / Capacitor (local)

```bash
npm run cap:sync
npm run cap:ios   # Xcode → Simulator or device
```

Not in CI — signing identities and App Store Connect stay on your Mac.

---

## 5. Checklist after connecting Netlify

- [ ] Env vars set in Netlify (not in git)
- [ ] Supabase redirect URLs include Netlify domain
- [ ] Magic link email opens deployed site
- [ ] Age gate → sign in → log pint (manual smoke)
- [ ] Find → 0.0 on Draught (after Phase 2 migration)
- [ ] Log row in [QA-TEST-PLAN.md](./QA-TEST-PLAN.md) Test log

---

## Decisions log

| Date | Decision | Why |
|------|----------|-----|
| 2025-06 | CI uses placeholder Supabase | No secrets in repo; smoke tests mock API |
| 2025-06 | Migrations manual | Safer than auto-apply to production |
| 2025-06 | Netlify deploy opt-in via `ENABLE_NETLIFY_DEPLOY` | Avoid surprise deploys before site exists |
