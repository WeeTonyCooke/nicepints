# NicePints Drink Discovery Architecture v1.0
### Database Migration + Product Model Consolidation

---

## Executive Summary

NicePints currently sits between two architectures:

1. A hardcoded drink model based around `PINT_TYPES`
2. A database-driven product model using `products` and `pints.product_id`

This specification completes the migration to a fully product-driven architecture.

The objective is to support:

- Find the best Guinness near me
- Find the best Guinness 0.0 near me
- Find the best Beamish near me
- Find the best Murphy's near me

while allowing future expansion to:

- Country-specific drink discovery
- Unlimited drink catalogue growth
- User-submitted drink suggestions
- Search-driven popularity rankings

without requiring database redesigns or frontend code changes.

---

## Implementation status (2026-06-17)

**Shipped in app code** — commit `794eab8` on `main`:

| Area | Status | Notes |
|------|--------|-------|
| Migration SQL | ✅ In repo | `supabase/migrations/20250624000000_product_discovery_architecture.sql` |
| Apply migration in production | ⏳ Manual | Run in Supabase SQL Editor — required for `product_regions` featured drinks |
| `Product` types + fetchers | ✅ | `src/data/products.ts`, `src/data/pintMapping.ts` |
| Pint queries join `products` | ✅ | `src/data.ts`, `src/data/discovery.ts` |
| `saveLivePint()` writes `product_id` | ✅ | Keeps `pint_type` for compatibility |
| Add Pint product UX | ✅ | Featured · recently logged · search all drinks |
| Discovery filters by slug / `product_id` | ✅ | Presets resolve via product slug |
| Pub detail groups by product | ✅ | Legacy rows fall back to `pint_type` |
| E2E fixtures with product joins | ✅ | 43/43 Playwright tests pass |

**Not yet built** (Phase 6 / later):

- Drink suggestions UI ("Can't find your drink?")
- `search_count` analytics / popularity from `product_metrics`
- Admin dashboard for drink approval
- Legacy + product rows merging into one pub-detail group when slug matches but `product_id` was null

**File name note:** This spec references `Discover.tsx` / `Home.tsx`; the live app uses `MapView.tsx` (Find a Pour) and `HomeFeed.tsx` (feed).

---

## Objectives

The architecture must:

- Remove hardcoded drink definitions from the frontend
- Make `products` the source of truth
- Support country-specific featured drinks
- Support future drink expansion
- Preserve all existing data
- Avoid breaking existing pints and ratings
- Allow discovery to evolve without schema changes
- Keep the drink-selection screen fast and uncluttered as the catalogue grows from 5 products to potentially hundreds

---

## Current Problems

> **Update (2026-06-17):** Phases 2–5 below are implemented in app code (`794eab8`). Remaining gap: apply `20250624000000_product_discovery_architecture.sql` in production Supabase, and optional Phase 6 (drink suggestions UI, search analytics).

### Hardcoded Drink Definitions — resolved in UI

The app no longer renders drink lists from `PINT_TYPES` on Add Pint. `PINT_TYPES` remains in `src/data/types.ts` for legacy type compatibility and mapper fallbacks only.

### Incomplete Product Migration — resolved on save path

`saveLivePint()` now persists `product_id` alongside `pint_type`. Historical pints without `product_id` still display via joined product or `pint_type` fallback.

### Original spec notes (pre-ship)

<details>
<summary>Historical problem statements (archived)</summary>

### Hardcoded Drink Definitions

The application still contains, in `src/data/types.ts`:

```
PINT_TYPES = [
  'Guinness',
  'Guinness 0.0',
  'Beamish',
  'Murphy's',
  'Other'
]
```

This prevents:

- Adding new drinks without code changes
- Country-specific drink discovery
- Dynamic featured products

### Incomplete Product Migration

The database already contains `products` and `pints.product_id` (added in `supabase/migrations/20250622000000_phase2_discovery.sql`).

However, `saveLivePint()` in `src/data.ts` currently persists `pint_type` only. **This is confirmed** — the insert payload writes `pint_type: input.pintType` and never sets `product_id`. Every pint created since the Phase 2 migration shipped has `product_id = null`.

This means the migration is incomplete and actively regressing with every new pint logged.

</details>

---

## Core Principle

Products must be the source of truth.

The application should function correctly when a new product is added to Supabase without requiring a frontend deployment.

---

## Database Changes

New migration file:

```
supabase/migrations/20250624000000_product_discovery_architecture.sql
```

### Extend Products

Current:

```
products
- id
- slug
- name
- brand
- is_non_alcoholic
- active
```

Add:

```sql
alter table products
  add column if not exists category text,
  add column if not exists country_of_origin text;
```

Supported categories:

```
stout
lager
cider
ale
ipa
porter
wheat_beer
pilsner
alcohol_free
other
```

```sql
alter table products drop constraint if exists products_category_check;
alter table products add constraint products_category_check
check (
  category is null or category in (
    'stout', 'lager', 'cider', 'ale', 'ipa', 'porter',
    'wheat_beer', 'pilsner', 'alcohol_free', 'other'
  )
);
```

Seed/update starter products:

```sql
update products set
  category = 'stout',
  country_of_origin = 'IE'
where slug in ('guinness', 'beamish', 'murphys');

update products set
  category = 'alcohol_free',
  country_of_origin = 'IE'
where slug = 'guinness-00';

update products set
  category = 'other'
where slug = 'other';
```

### Product Regions

```sql
create table if not exists product_regions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  country_code text not null,
  popularity_score integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(product_id, country_code)
);

create index if not exists product_regions_country_score_idx
on product_regions(country_code, active, popularity_score desc);
```

Purpose: associate products with countries and allow country-specific discovery.

| Product | Country |
|---|---|
| Guinness | IE |
| Guinness | GB |
| Guinness | US |
| Beamish | IE |
| Murphy's | IE |
| Moretti | IT |

Initial seed (Ireland):

```sql
insert into product_regions (product_id, country_code, popularity_score)
select id, 'IE',
  case slug
    when 'guinness' then 100
    when 'guinness-00' then 90
    when 'beamish' then 80
    when 'murphys' then 75
    when 'other' then 1
    else 0
  end
from products
where slug in ('guinness', 'guinness-00', 'beamish', 'murphys', 'other')
on conflict (product_id, country_code) do nothing;
```

Optional UK seed:

```sql
insert into product_regions (product_id, country_code, popularity_score)
select id, 'GB',
  case slug
    when 'guinness' then 100
    when 'guinness-00' then 85
    when 'beamish' then 60
    when 'murphys' then 60
    else 0
  end
from products
where slug in ('guinness', 'guinness-00', 'beamish', 'murphys')
on conflict (product_id, country_code) do nothing;
```

### Product Metrics

```sql
create table if not exists product_metrics (
  product_id uuid primary key references products(id) on delete cascade,
  search_count integer not null default 0,
  rating_count integer not null default 0,
  favourite_count integer not null default 0,
  updated_at timestamptz not null default now()
);
```

Purpose: measure actual usage instead of hardcoding popularity. Future featured-drink ranking should be generated from these metrics, blended with `product_regions.popularity_score`.

Seed from existing pints:

```sql
insert into product_metrics (product_id, rating_count)
select product_id, count(*)
from pints
where product_id is not null
group by product_id
on conflict (product_id)
do update set
  rating_count = excluded.rating_count,
  updated_at = now();
```

### Drink Suggestions

```sql
create table if not exists drink_suggestions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  category text,
  country_code text,
  submitted_by uuid references auth.users(id) on delete set null,
  submitted_email text,
  status text not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now()
);

alter table drink_suggestions drop constraint if exists drink_suggestions_status_check;
alter table drink_suggestions add constraint drink_suggestions_status_check
check (status in ('pending', 'approved', 'rejected'));

create index if not exists drink_suggestions_status_idx
on drink_suggestions(status, created_at desc);
```

Purpose: allow users to suggest drinks while retaining moderation control. Admin approval remains manual in the Supabase dashboard for now.

### Row Level Security

This repo's convention (see `pub_requests`, `pint_reports`, `pubs`, `account_deletion_requests` in prior migrations) is that every new table gets RLS enabled with explicit policies. This migration follows the same pattern:

```sql
alter table product_regions enable row level security;
alter table product_metrics enable row level security;
alter table drink_suggestions enable row level security;

create policy "Public read product regions"
on product_regions for select
using (active = true);

create policy "Public read product metrics"
on product_metrics for select
using (true);

create policy "Signed-in users can suggest drinks"
on drink_suggestions for insert
to authenticated
with check (auth.uid() = submitted_by);
```

No public read policy on `drink_suggestions` — review happens via the Supabase dashboard, consistent with how `pub_requests` and `pint_reports` are handled today.

---

## Product Model (Frontend Types)

```typescript
export type ProductCategory =
  | 'stout'
  | 'lager'
  | 'cider'
  | 'ale'
  | 'ipa'
  | 'porter'
  | 'wheat_beer'
  | 'pilsner'
  | 'alcohol_free'
  | 'other';

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  category?: ProductCategory;
  countryOfOrigin?: string;
  isNonAlcoholic: boolean;
  active: boolean;
};
```

Products become the source of truth for all drink-related functionality.

### Remove PINT_TYPES as a UI source of truth

`PINT_TYPES` and `PintType` are currently used throughout `src/data/types.ts`, `src/data.ts`, and `src/pages/AddPint.tsx`. Drink lists must be loaded dynamically via `fetchActiveProducts()` from Supabase rather than read from a static array.

Keep `pintType?: string` on the `Pint` type temporarily for backwards compatibility. New components should read `pint.productName`, not `pint.pintType`.

---

## Featured Drinks

The homepage / Add Pint screen should not display a fixed list.

Process:

1. Detect user country
2. Query `product_regions` for that country
3. Order by `popularity_score` desc, then `product_metrics.rating_count` desc, then `products.name` asc
4. Return top 5–7 products

Example — Ireland:

- Guinness
- Guinness 0.0
- Beamish
- Murphy's
- Smithwick's
- Bulmers
- Rockshore

Example — Germany:

- Augustiner
- Paulaner
- Erdinger
- Guinness

The list must be entirely data-driven. Fallback: if no country-specific rows exist in `product_regions`, return active products ordered by `rating_count` / name.

---

## Search Architecture

Separate:

- **Featured Drinks** — top products for the user's country, surfaced by default
- **Search** — all active products, reached deliberately

This allows the catalogue to grow indefinitely without redesigning the UI. The default screen must never grow past the featured set, regardless of how large `products` becomes — catalogue growth should be invisible at the point of logging a pint unless the user actively searches.

---

## Add Pint Screen — UX Requirements

The data architecture change has direct UX consequences once `AddPint.tsx` stops rendering 5 fixed buttons and starts rendering a Supabase-driven list. These requirements keep the screen usable as the catalogue grows, and apply lessons from comparable fast-context mobile flows (e.g. transit apps designed for low-attention use):

1. **Featured products stay visually dominant.** The 5–7 country-featured products should render as large, high-contrast, easily tappable buttons — this is the primary path and should look like it.
2. **"Search all drinks" is present but visually secondary.** It's the escape hatch, not the default. A text link or smaller button below the featured set is sufficient; it should not compete with featured items for attention.
3. **Add a "Recently logged" row.** Surface the user's last 1–3 distinct products (by `product_id`) above or alongside the featured list. Most repeat users will log the same 2–3 drinks; this is faster than featured-list scanning and should take priority when it has data. Falls back to featured-only if the user has no prior pints.
4. **Selecting a product stores `productId`, not a drink name string.**
5. **Instant visual confirmation on selection** (highlight / checkmark) — keeps the under-20-second flow feeling responsive even as the list source changes from static to dynamic.

### Serving Type Logic

Current hardcoded checks (`pintType === 'Guinness 0.0'`) must be replaced with product-attribute logic:

```typescript
const requiresServingType = selectedProduct.isNonAlcoholic;
const showServingType = selectedProduct.isNonAlcoholic || selectedProduct.category === 'stout';
```

If this proves awkward in practice for v1, keep serving type visible for all products — that's safer than re-introducing a hardcoded drink-name check.

---

## Pint Data Model

```typescript
Pint {
  productId
  pubId
  score
  servingType
  photo
  note
}
```

Do not use drink names as identifiers. Use `product_id` as the primary identifier going forward.

---

## Critical Save Path Migration

**Current state (confirmed against `src/data.ts`):**

`saveLivePint()` inserts:

```typescript
{
  pub_id: input.pubId,
  user_id: session.user.id,
  user_name: userName,
  score: input.rating,
  caption: input.comment,
  pint_type: input.pintType,
  serving_type: input.servingType,
  photo_url: photoUrl,
}
```

`product_id` is never set. This is the single most urgent fix in this spec — every pint logged before this ships continues the data gap.

**Required change:**

```typescript
{
  pub_id: input.pubId,
  user_id: session.user.id,
  user_name: userName,
  score: input.rating,
  caption: input.comment,
  product_id: selectedProduct.id,
  pint_type: selectedProduct.name, // kept for compatibility
  serving_type: input.servingType,
  photo_url: photoUrl,
}
```

**Acceptance criteria:**

- Every newly created pint must contain `product_id` when a valid product exists.
- No new records should be created with only `pint_type` unless no product match exists (e.g. a "Other" free-text case, if that path is kept).

---

## Backwards Compatibility

Existing pints must continue to work. Resolution order for display:

1. Joined `products` relationship (via `product_id`)
2. `pint_type` string
3. "Unknown Drink"

No historical data should disappear. Keep `pint_type` as a column during and after this migration — do not drop it.

---

## Discovery Changes

**Affected file:** `src/data/discovery.ts`

Current discovery logic (`findPours`, `PourFilter`) relies on `pintType` string matching. Replace with `productId` / `productSlug`.

```typescript
export type PourFilter = {
  preset?: PourPresetId;
  productId?: string | null;
  productSlug?: string | null;
  servingType?: ServingType | null;
  minScore?: number;
  recencyDays?: RecencyDays;
  maxDistanceKm?: number | null;
  searchQuery?: string;
  userCoords?: Coordinates | null;
};
```

Presets resolve via product slug, not display name:

```typescript
case 'guinness-00-draught':
  return {
    productSlug: 'guinness-00',
    servingType: 'draught',
    minScore: 8,
    recencyDays: 30,
    maxDistanceKm: 5,
  };
```

If `productSlug` is provided, resolve to `product_id` (or join `products` by slug) before filtering. Prefer `product_id` once available on a row.

---

## Pub Detail Page Migration

**Affected files:**

- `src/pages/PubDetail.tsx` — contains `buildPourBreakdown()`
- `src/data.ts` — `getPintsByPubId()` is the query that feeds `PubDetail.tsx`, and currently selects `pint_type` only with no `products` join. **This query must be updated alongside the grouping function below**, or `buildPourBreakdown()` will have no product data to group on regardless of how its logic changes.

### Current Problem

`buildPourBreakdown()` currently groups ratings using a raw string key: `` `${pint.pintType}|${pint.servingType}` ``.

Once new rows carry `product_id` while legacy rows carry only `pint_type`, the same drink can split into two separate groups on the pub page — a real-looking Guinness pour and a legacy-row Guinness pour will not merge.

### Required Change

Grouping priority:

```typescript
const groupKey =
  product?.slug ??
  product?.id ??
  pint.pint_type ??
  'unknown';
```

This requires `getPintsByPubId()` (and `getPintById()`, used by `PintDetail.tsx`) to select the joined `products` relation, not just `pint_type` — see Data Layer Changes below.

### Acceptance Criteria

- The Pub Detail page must group all Guinness ratings together, all Guinness 0.0 ratings together, all Beamish ratings together — regardless of whether individual rows are pre- or post-migration.
- Legacy rows (string-only) and new rows (product-linked) for the same drink must merge into one group.
- Users must never see duplicate product groups caused by migration state.

---

## Pub Ratings vs Drink Ratings

Keep these concepts separate.

**Drink Rating** — quality of a specific product at a specific pub. Example: Guinness at Mulligan's.

**Pub Rating** — overall venue quality. Not yet implemented as a distinct concept.

Current pub averages (`getPubRating()`) may remain for now, but if displayed publicly should be labelled **"Average Pint Score"**, not "Pub Rating," until a dedicated venue review system exists. Do not imply a venue-quality score that isn't actually being captured.

A future, optional `pub_reviews` table (overall/atmosphere/service scores) is out of scope for this phase — do not build it yet.

---

## Data Layer Changes

### Product Fetchers

```typescript
fetchActiveProducts(): Promise<Product[]>
```
Query: `products` where `active = true`, ordered by `name`.

```typescript
fetchFeaturedProducts(countryCode: string, limit = 7): Promise<Product[]>
```
Query: `product_regions` joined to `products`, filtered to the given `country_code` and `active = true`, ordered by `popularity_score` desc, then `rating_count` desc, then `name` asc. Falls back to active products by rating count / name if no country-specific rows exist.

### Update Pint Queries

Affected: `getPintById()`, `getPintsByPubId()` in `src/data.ts`, and the equivalent select in `src/data/discovery.ts`.

These currently select `pint_type` only. They must also select:

```sql
product_id,
products (
  id, slug, name, brand, category, country_of_origin, is_non_alcoholic, active
)
```

Mapping should prefer the joined product:

```typescript
productName = pint.products?.name ?? pint.pint_type ?? 'Unknown Drink';
productSlug = pint.products?.slug ?? null;
productId = pint.product_id ?? null;
```

Do not break display of old data that has no `product_id`.

### Update Save Pint

See Critical Save Path Migration above.

---

## Search Count / Metrics

When a user searches for a product or taps a featured product, increment `product_metrics.search_count`. This can be v2 — for v1, create the table and seed `rating_count` only. Do not block v1 on full metrics automation.

Future RPC: `increment_product_search(product_id uuid)`.

---

## Drink Suggestions Flow

Optional UI for v1: a small "Can't find your drink?" link from the Add Pint screen.

Form fields: name, brand/brewery, category, country, optional note.

On submit: insert into `drink_suggestions`, show confirmation — *"Thanks — we'll review it before adding it."*

Suggested drinks never become public products automatically. Admin approval remains manual in the Supabase dashboard.

---

## Files Expected To Change

```
src/data.ts
src/data/discovery.ts
src/data/types.ts
src/pages/AddPint.tsx
src/pages/PubDetail.tsx
src/pages/MapView.tsx (Find a Pour)
src/pages/HomeFeed.tsx (feed)
supabase/migrations/*
e2e/*
```

Search for and migrate where appropriate:

```
PINT_TYPES
PintType
pintType
pint_type
```

Do not remove database-level `pint_type` compatibility. Do remove `PINT_TYPES` as a UI source of truth.

---

## E2E Test Requirements

Current fixtures (`e2e/fixtures.ts`, `e2e/helpers.ts`) mock Supabase responses by hand using `pint_type` only, e.g.:

```typescript
{ pint_type: 'Guinness' }
```

Once `data.ts` / `discovery.ts` select joined `products` data, these fixtures must be updated to match the real response shape, or tests will pass against unrealistic data and silently stop catching regressions:

```typescript
{
  pint_type: 'Guinness',
  product_id: '123',
  products: {
    id: '123',
    slug: 'guinness',
    name: 'Guinness',
  },
}
```

There is currently no `npm run lint` script in `package.json` — use `npm run typecheck` and `npm run test:e2e` (or `npm run build`) as the verification gate instead.

### Test Cases

1. Add Pint page loads products from Supabase.
2. User can select Guinness.
3. User can select Guinness 0.0.
4. Guinness 0.0 requires/prompts for serving type.
5. Saving a pint writes `product_id`.
6. Saved pint displays product name.
7. Old pint with only `pint_type` still displays correctly.
8. Discovery preset "Guinness 0.0 draught" still works.
9. Discovery results group by pub and show product name.
10. Pub Detail merges legacy and product-linked rows for the same drink into one group.
11. "Recently logged" row appears when the user has prior pints, and is absent (falls back to featured only) when they don't.
12. No hard crash if product fetch fails.

---

## Rollout Plan

> **Status:** Phases 1–5 complete in app code (`794eab8`). Phase 6 optional items remain.

**Phase 1 — Database** ✅ SQL in repo — ⏳ apply in production Supabase
Extend `products`; add `product_regions`, `product_metrics`, `drink_suggestions` with RLS; seed Ireland starter products. No UI changes.

**Phase 2 — Data Layer** ✅
Add `Product` type; add product fetchers; update pint queries (`getPintById`, `getPintsByPubId`, discovery select) to join `products`; update pint mapper with fallback to `pint_type`. UI should still work unchanged.

**Phase 3 — Save Path** ✅
Update `saveLivePint()` to persist `product_id`; retain `pint_type` for compatibility. This is the highest-priority functional fix in the whole spec.

**Phase 4 — Frontend** ✅
Replace `PINT_TYPES` buttons with products fetched from Supabase; apply the Add Pint UX requirements (featured-dominant, search-secondary, recently-logged row); save `product_id` on selection.

**Phase 5 — Discovery** ✅
Replace `pintType` filtering with `productId`/`productSlug` filtering; convert presets to slug-based resolution; update `PubDetail.tsx` grouping to the product-priority key.

**Phase 6 — Optional** ⏳
Drink suggestions UI ("Can't find your drink?"); search analytics (`search_count` increments); popularity rankings driven by `product_metrics`.

---

## Acceptance Criteria

> **App code:** met by `794eab8` (pending production migration apply for featured-by-country data).

This work is complete when:

- No drink list is hardcoded in the frontend.
- Products come from Supabase.
- New products can be added without a frontend deployment.
- `saveLivePint()` persists `product_id` on every new pint where a product match exists.
- Existing pints still display correctly (joined product, then `pint_type`, then "Unknown Drink").
- Discovery filters by product, not raw string.
- Featured drinks vary by country and are never a fixed list.
- The default Add Pint screen never shows more than the featured set (5–7) plus the recently-logged row, regardless of catalogue size.
- Drink suggestions can be stored for later admin review.
- `PubDetail.tsx` groups ratings by product identity, merging legacy and new rows.
- No historical data is lost.
- Build passes (`npm run typecheck`, `npm run build`).
- E2E tests pass, with fixtures updated to reflect the real `products` join shape.

---

## Explicit Non-Goals

Do not build, in this phase:

- Full admin dashboard
- Automatic drink approval
- Brewery database
- Complex regional ranking algorithm
- Dedicated venue review system (`pub_reviews`)
- Global catalogue of hundreds of beers (seed only Ireland, optionally UK)

These can be introduced later without changing this architecture.

---

## Final Success Condition

NicePints should be able to answer:

**"Find the best pint of X near me."**

Where X is Guinness, Guinness 0.0, Beamish, Murphy's, or any future product added to the database — without requiring code changes, and without the Add Pint screen becoming slower or more cluttered as that catalogue grows.
