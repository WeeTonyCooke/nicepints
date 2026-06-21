-- Run in Supabase SQL Editor (Dashboard → SQL → New query)
-- Checks that all Nice Pints migrations are applied correctly.

-- 1) Core tables exist
select
  to_regclass('public.products') is not null as products_table,
  to_regclass('public.product_regions') is not null as product_regions_table,
  to_regclass('public.product_metrics') is not null as product_metrics_table,
  to_regclass('public.drink_suggestions') is not null as drink_suggestions_table,
  to_regclass('public.pub_requests') is not null as pub_requests_table,
  to_regclass('public.pint_reports') is not null as pint_reports_table;

-- 2) Product catalog (expect 13 active rows after expand migration)
select count(*) as active_product_count
from products
where active = true;

select slug, name, category, country_of_origin, is_non_alcoholic
from products
where active = true
order by slug;

-- 3) Ireland featured rankings (expect 13 rows, scores 100 down to 1)
select p.slug, p.name, pr.popularity_score
from product_regions pr
join products p on p.id = pr.product_id
where pr.country_code = 'IE'
  and pr.active = true
order by pr.popularity_score desc;

-- 4) Pints linked to products (expect 0 rows with null product_id for known pint_types)
select count(*) as pints_missing_product_id
from pints
where product_id is null
  and pint_type in ('Guinness', 'Guinness 0.0', 'Beamish', 'Murphy''s', 'Other');

-- 5) Phase 2 / Places columns
select
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pints'
      and column_name = 'serving_type'
  ) as pints_has_serving_type,
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pubs'
      and column_name = 'google_place_id'
  ) as pubs_has_google_place_id;

-- 6) RLS on products (must have a SELECT policy or the app sees an empty drink list)
select c.relrowsecurity as products_rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'products';

select policyname, cmd, qual
from pg_policies
where schemaname = 'public'
  and tablename = 'products';

-- 7) Account deletion RPC
select exists (
  select 1
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'purge_my_account_data'
) as purge_rpc_exists;
