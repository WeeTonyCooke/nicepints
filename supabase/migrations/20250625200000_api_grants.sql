-- Explicit Data API grants for tables created via migrations.
-- Local Supabase CLI no longer auto-grants anon/authenticated on new public tables;
-- without these, PostgREST returns 403 and live e2e cannot read products or the feed.

-- Core app tables (public read)
grant select on table public.pubs to anon, authenticated;
grant select on table public.pints to anon, authenticated;
grant select on table public.products to anon, authenticated;
grant select on table public.product_regions to anon, authenticated;
grant select on table public.product_metrics to anon, authenticated;

-- Authenticated writes (RLS policies enforce row-level rules)
grant insert on table public.pubs to authenticated;
grant insert, update, delete on table public.pints to authenticated;
grant insert on table public.pub_requests to anon, authenticated;
grant insert on table public.pint_reports to authenticated;
grant insert on table public.drink_suggestions to authenticated;
grant insert on table public.account_deletion_requests to authenticated;

-- Pint photo storage (public read URLs, authenticated upload)
grant select on table storage.objects to anon, authenticated;
grant insert on table storage.objects to authenticated;

-- Service role (admin e2e helpers, migrations, dashboard)
grant all on table public.pubs to service_role;
grant all on table public.pints to service_role;
grant all on table public.products to service_role;
grant all on table public.product_regions to service_role;
grant all on table public.product_metrics to service_role;
grant all on table public.pub_requests to service_role;
grant all on table public.pint_reports to service_role;
grant all on table public.drink_suggestions to service_role;
grant all on table public.account_deletion_requests to service_role;
grant all on table storage.objects to service_role;
