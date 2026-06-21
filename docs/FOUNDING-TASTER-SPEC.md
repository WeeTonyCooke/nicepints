# Founding Taster — minimal cold-start outreach

**Status:** Shipped — PR #17 merged 2026-06-21. Migration `20250627000000_founding_taster.sql` applied in production. **Operational:** flag each invitee manually when outreach begins (no users flagged yet).

**Type:** Small, fast feature. Scoped specifically to courting a known, named handful of people (5–10) pre-launch — not a general-purpose public profile system. The full `public-profiles-reputation-system-v1.0.md` doc remains a separate, larger, later piece of work.

**Goal:** Get a small number of specific, respected people to join before public launch and post genuinely good content, so the app doesn't look empty when it opens. The mechanism is making each of them feel individually, permanently recognized — not building a scalable profile feature.

---

## What this is NOT

- Not fake/seeded engagement (violates DESIGN-PRINCIPLES #7).
- Not the full Public Profiles architecture (no `@username` URLs, leaderboard, badge-management UI).
- Not a leaderboard of any kind.
- Not volume-based stats for founding members.

---

## Implementation

### Database

Column on `user_trust_signal` (same table as trust signal — no separate `profiles` table):

```sql
alter table user_trust_signal
  add column if not exists is_founding_taster boolean not null default false;
```

Set manually in Supabase dashboard only:

```sql
insert into user_trust_signal (user_id, is_founding_taster)
values ('<auth-user-uuid>', true)
on conflict (user_id) do update set is_founding_taster = true;
```

`recompute_user_trust_signals()` does not update `is_founding_taster` on conflict — manual flags are preserved.

### UI

- **FoundingTasterMark** — cream ring (`border-cream`, `#F3EFE6`), visually distinct from sage trust dot.
- Shown in **AuthorAttribution** next to name (founding mark before trust mark when both apply).
- No in-app explanation/tooltip — same subtlety as trust signal.
- **v1: badge-only** — no private stat line ("one of the first 10", etc.).

### Outreach (not code)

Reach out individually before they join; ask for concrete input on something real. That is the main lever — not a UI feature.

---

## Acceptance criteria

- [x] `is_founding_taster` on `user_trust_signal`, default `false`, settable only via database
- [x] Cream mark next to name wherever `AuthorAttribution` is used
- [x] No public explanation text
- [x] No stat line for founding tasters in v1
- [x] No leaderboard, public profile URLs beyond existing `/user/:id`, or admin UI
