-- Phase 1: pub requests + pint reports
-- Run in Supabase SQL Editor or via CLI: supabase db push

create table if not exists pub_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  user_email text,
  pub_name text not null,
  city text not null,
  country text not null default 'Ireland',
  note text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists pint_reports (
  id uuid primary key default gen_random_uuid(),
  pint_id uuid not null references pints (id) on delete cascade,
  reporter_id uuid references auth.users (id) on delete set null,
  reporter_email text,
  reason text not null,
  details text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists pub_requests_status_idx on pub_requests (status, created_at desc);
create index if not exists pint_reports_pint_idx on pint_reports (pint_id, created_at desc);
create index if not exists pint_reports_status_idx on pint_reports (status, created_at desc);

alter table pub_requests enable row level security;
alter table pint_reports enable row level security;

-- Anyone can request a pub (signed-in or guest with email)
create policy "Anyone can insert pub requests"
  on pub_requests for insert
  with check (
    auth.uid() = user_id
    or (user_id is null and user_email is not null and length(trim(user_email)) > 0)
  );

-- Signed-in users can insert reports
create policy "Signed-in users can report pints"
  on pint_reports for insert
  with check (auth.uid() = reporter_id);

-- No public read on moderation tables (review via Supabase dashboard)
