# Spec: Profile trust signal (consensus agreement) + favourites

**Status:** Shipped — PR #16 merged 2026-06-21. Migration `20250626000000_profile_trust_signal.sql` applied in production; daily `recompute_user_trust_signals()` cron scheduled (`0 3 * * *`).

**Type:** New feature — schema additions, backend scoring logic, subtle UI signal. Not a leaderboard, not explicit ranking. Deliberately scoped to avoid the rejected "Leaderboards for most pints logged" pattern in `docs/DESIGN-PRINCIPLES.md`.

**What this is:** A quiet, non-numeric signal that surfaces near a person's name on their posts when their pint scores have a track record of matching what the wider community later says about the same pints. Combined with a secondary signal from being widely favourited by other users. No public ranking, no leaderboard, no visible score or tier — small mark only, per the explicit decision to keep this subtle.

**What this explicitly is not:**
- Not a leaderboard (no sorted list of "top" people anywhere)
- Not based on volume/frequency of posting (the exact thing `DESIGN-PRINCIPLES.md` rejects)
- Not a public numeric score or visible tier system
- Not gamification in the streaks/badges/points sense Principle #2 and the "doesn't fit" table warn against — this is closer to a trust/credibility signal than an achievement system

---

## 0. The core design problem this spec has to solve

"Agreement with consensus" sounds simple but has a real ordering problem: **you can't measure agreement with a consensus that doesn't exist yet.** Two specific failure modes to design around, not leave as open questions:

1. **Early/first raters get unfairly penalized.** If someone is the very first to rate a pint at a new pub, there's no consensus yet to agree or disagree with. A naive implementation would either skip them (fine) or — worse — count their own rating as 100% of the "consensus" at that moment, making them trivially always "in agreement" with themselves. Both are wrong; the fix is below.
2. **Whoever rates a busy, well-established pub is just measuring conformity, not skill.** Someone who only ever rates the most popular spot in Dublin will naturally cluster near the mean without that reflecting any actual palate/judgement — versus someone consistently rating obscure pubs accurately before anyone else has weighed in, which is a stronger trust signal but harder to detect with a naive "close to average" check.

### Resolution

**A rating only counts toward someone's consensus-agreement signal once the pub+product+serving combination has at least N other independent ratings from other users, posted after theirs, to compare against.** This makes the metric retrospective and self-correcting:

- Someone's very first pint-logged-here doesn't count toward their signal yet — it's pending, not penalized, not auto-credited.
- Once enough other people have independently rated the same pub+product+serving (suggest **N = 3 other raters**, tunable), go back and check: was their original score close to the resulting weighted consensus (reuse the existing `display_score` decay formula from `docs/ROADMAP.md`'s "Weighted pub+product+serving score")?
- This rewards exactly the case you described — someone who calls it accurately *before* the crowd catches up — without rewarding someone who just always rates the one pub everyone already agrees on.

---

## 1. Schema additions

New table, not new columns on `pints` — this is a derived/computed signal, not raw user input, so it belongs in its own table that can be recalculated without touching the source data.

```sql
-- supabase/migrations/[next-timestamp]_profile_trust_signal.sql

create table if not exists user_trust_signal (
  user_id uuid primary key references auth.users (id) on delete cascade,
  agreement_score numeric, -- nullable until they have enough resolved ratings to compute
  resolved_rating_count integer not null default 0, -- how many of their ratings have been checked against consensus
  favourite_count integer not null default 0,
  is_recognized boolean not null default false, -- the actual on/off flag the UI reads
  last_computed_at timestamptz not null default now()
);

alter table user_trust_signal enable row level security;

drop policy if exists "Public read trust signal" on user_trust_signal;
create policy "Public read trust signal"
  on user_trust_signal for select
  using (true);

-- No public insert/update policy — written only by a backend job/function, never directly by users.
```

```sql
create table if not exists profile_favourites (
  id uuid primary key default gen_random_uuid(),
  favourited_by uuid not null references auth.users (id) on delete cascade,
  favourited_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (favourited_by, favourited_user_id),
  check (favourited_by != favourited_user_id) -- can't favourite yourself
);

alter table profile_favourites enable row level security;

drop policy if exists "Users manage own favourites" on profile_favourites;
create policy "Users manage own favourites"
  on profile_favourites for all
  to authenticated
  using (auth.uid() = favourited_by)
  with check (auth.uid() = favourited_by);

drop policy if exists "Public read favourite counts" on profile_favourites;
create policy "Public read favourite counts"
  on profile_favourites for select
  using (true);
```

**Action item for Cursor:** confirm actual `auth.users` reference pattern matches what's already used elsewhere in the schema (check how `pints.user_id` references users in the migration that added it — likely `20250621000000_pint_user_id_ownership.sql` — and mirror that exact pattern rather than assuming `auth.users` is the right reference table without checking).

---

## 2. Computing `agreement_score`

This is a backend job, not something computed live on every page load — recalculating consensus-agreement for every user on every request would be expensive and unnecessary, since trust shouldn't change minute-to-minute.

**Recommended: a Postgres function + scheduled job (Supabase cron or a Netlify scheduled function), not a database trigger** — agreement can only be assessed once enough *other* people have rated the same thing, which means it has to run periodically and look backward, not fire instantly on insert.

### Pseudocode for the calculation

```
for each pint rating R by user U:
  find all other ratings for the same (pub_id, product_id, serving_type)
    posted by users other than U, with created_at > R.created_at
  if count(other ratings) < 3:
    skip — not enough consensus yet to judge R against
  else:
    consensus_score = weighted_average(other ratings, using existing decay formula)
    agreement = 1 - (abs(R.score - consensus_score) / 10)  -- 0 to 1, closer = higher
    mark R as resolved, record agreement value

user's agreement_score = average(agreement values across all their resolved ratings)
user's resolved_rating_count = count of resolved ratings
```

**Threshold for `is_recognized = true`:** suggest requiring both a minimum `resolved_rating_count` (e.g. 5) and a minimum `agreement_score` (e.g. 0.75) — both gates needed so a single lucky early call doesn't flip someone to "recognized" instantly, and so the signal reflects a track record, not a coincidence. **Exact thresholds are a judgement call — flag to Anthony before finalizing, easy to tune once real data exists.**

---

## 3. Favourites feeding into recognition

Per the decision, favourite count is a secondary input alongside agreement — not a separate, independent path to recognition. Two reasonable ways to combine them, pick one:

**Option A (recommended, simpler):** Favourites act as a *modifier* on the threshold, not a separate qualifying path — e.g. someone with `agreement_score` just under the normal bar can still qualify if their `favourite_count` is high enough to suggest the community already trusts them independently. This keeps agreement as the core signal (per your stated priority) while letting genuine community recognition (e.g. an influencer people already trust) count for something, without making favourites alone sufficient to qualify.

**Option B:** Two fully independent flags (`is_recognized_by_consensus`, `is_recognized_by_popularity`), with the UI showing the same subtle mark regardless of which one triggered it. More flexible, more complex, and risks the mark meaning two different things while looking identical — **probably overkill for v1**, flagging only so it's a documented rejected alternative, not an oversight.

**Action item for Cursor:** implement Option A unless Anthony specifies otherwise.

### Influencer case, specifically

Per your example — someone joins, is already known, and starts rating — they won't have `resolved_rating_count` yet (no history on this platform). Favourites-as-modifier (Option A) is exactly what lets a genuinely well-known person earn the subtle mark faster than the cold-start consensus math alone would allow, without a manual admin override. **This is the mechanism, not a separate special-case for influencers** — same system, same gate, just reachable via a different combination of inputs. No separate "verified" flag or manual tagging needed for v1, which also avoids opening an admin-curation workflow that isn't asked for here.

---

## 4. UI — public mark (subtle, unchanged) vs. self-awareness (revised per BFM)

**Checked against Built for Mars before finalizing — one part of the original decision didn't hold up against the evidence and is revised below.** Full detail in §4c.

### 4a. Public-facing mark — stays exactly as subtle as decided

This part is unaffected by the BFM check — no evidence found arguing against a subtle, unexplained public mark, specifically.

- A small visual indicator next to the person's name wherever it appears on a pint post — feed card, pint detail, profile header. Suggest a single small icon/dot (not a badge with text) immediately adjacent to the name, similar in weight to how a verified-checkmark pattern works elsewhere, but **using existing token colors** — `gold` is reserved for primary CTAs per `DESIGN-PRINCIPLES.md` color rules ("Nowhere else" besides buttons/active nav/wordmark), so **do not use gold for this mark** — pick a different existing token (e.g. `sage`, since it already carries positive-quality meaning in the rating system) or propose a new minimal token if none fit, flagged for Anthony's sign-off.
- No tooltip, no explanatory text, no "Top Contributor" label on the public-facing mark itself — other people seeing it on someone else's post still get zero explanation.
- Does not appear at all for users who aren't `is_recognized` — no empty state, no "not yet ranked" placeholder, nothing. Absence is the default, not a lesser visible state.

### 4b. Self-awareness — revised: the person should know, even if no one else gets an explanation

**This is the part that changed.** The original draft made the entire mechanic invisible, including to the recognized person themselves. Checked against Built for Mars and found two relevant precedents that argue against that:

- **Google Maps** explicitly tells reviewers when their past contributions have been influential/seen (*"You're popular! 1,503 review views on Maps"*) — framed as increasing both volume and quality of future reviews, specifically because people know their work is actually being seen and valued.
- **Costa's loyalty case study** found that a complete absence of any acknowledgment moment — even an awkward one — undermines the sense of reward and erodes the motivating effect of the mechanic entirely.

Neither source argues for a public scoreboard or explained mechanic — both are compatible with the public mark in §4a staying exactly as quiet as decided. The evidence specifically argues against the person **themselves** having zero signal that anything is happening.

**Revised behaviour:** the recognized person sees their own status on their own profile only (private, low-key — not a notification, not a popup, not a number). E.g., a small note or the same subtle mark visible on their own profile view, with perhaps one line of plain-language context only visible to them there (not shown publicly) — something like noting their ratings have been consistently reliable, without exposing the mechanic's internals (no exact agreement score, no thresholds, no "you need 2 more ratings to qualify" progress bar, which would tip into gamification territory Principle #2 already rejects).

This keeps the system honest with the person it's evaluating, without making it public, numeric, or competitive — consistent with the original instinct to avoid an explicit leaderboard, just corrected on the one point where full silence (rather than full publicity) was the actual risk.

### Favouriting interaction (the follow mechanic itself)

- A favourite/follow action on someone's profile — button or icon, profile page only (not inline on every individual post, to avoid it becoming a constant ambient prompt, which would conflict with Principle #3 "calm interfaces").
- No public list of "who favourited you" shown to anyone else — but per the §4b revision, the person's own favourite count is reasonable to show privately on their own profile, consistent with letting people see their own standing without making it public or competitive. **Open question 3 below still applies** to the exact presentation.

---

## 5. Explicit non-goals

- No public leaderboard, sorted list, or ranking page anywhere — this spec produces zero new screens that rank people against each other.
- No numeric score, percentage, or tier shown to the user about themselves or anyone else — even the private self-awareness note in §4b stays plain-language, not a number or progress bar.
- No manual admin "verify this influencer" tooling — the favourites-as-modifier mechanism (§3) is the only path, deliberately, to avoid building a curation workflow that wasn't asked for.
- No retroactive recalculation UI or "why am I/aren't I recognized" explanation surface — per §4b, the person sees a plain-language status note on their own profile, but not the mechanic's internals (no exact agreement score, no thresholds, no progress-toward-qualifying indicator).
- No change to the existing pub+product+serving consensus score shown publicly on pint cards/details — this is a separate, new, person-level signal, not a replacement for the existing aggregate score logic.

---

## Acceptance criteria

- [x] `user_trust_signal` and `profile_favourites` tables created with RLS as specified — public read, write restricted appropriately (backend-only for trust signal, owner-only for favourites).
- [x] Agreement calculation correctly skips ratings with fewer than the threshold of other independent raters — verify with a test case: a single early rating on a brand-new pub should never resolve until enough others rate it too.
- [x] `is_recognized` requires both minimum resolved-rating-count and minimum agreement-score thresholds — not agreement alone, to avoid a single lucky early call qualifying someone immediately.
- [x] Favourites act as the modifier described in Option A — verify a highly-favourited but consensus-unproven profile (e.g. a fresh influencer account) can plausibly reach `is_recognized = true` faster than the cold-start math alone would allow.
- [x] UI mark appears only next to recognized users' names, using a non-gold existing token color, with no accompanying number/tier/tooltip.
- [x] No new public-facing ranking/leaderboard page exists anywhere in the app as a result of this work.

---

## Open questions — confirm before implementing

1. **Exact thresholds** (N=3 other raters for resolution, 5 resolved ratings + 0.75 agreement for recognition) — all proposed as reasonable starting points, not final. Recommend shipping with these, watching real data for a few weeks, then tuning — flagged as judgement calls, not blockers to starting the build.
2. **Mark color/icon** — gold is explicitly off-limits per existing token rules; need a concrete proposal (likely `sage` or a new minimal token) signed off before implementation, not guessed by Cursor mid-build.
3. **Favourite count visibility** — fully invisible (not even to the user themselves) vs. visible only in the user's own profile privately. Not resolved by the prior decisions; pick one before building the favourite-count UI surface, if any.
4. **Recalculation cadence** — how often the backend job re-runs (hourly, daily, on a Supabase cron schedule) is an infra judgement call for whoever implements, balancing freshness against cost; not specified here, flag a default (e.g. daily) for Anthony to confirm rather than guessing silently.
