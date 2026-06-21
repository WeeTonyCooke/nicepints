-- Base Nice Pints schema (pubs + pints + public read / authenticated write).
-- Later migrations extend columns, RLS, and catalog tables.

create table if not exists pubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country text not null default 'Ireland',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

create table if not exists pints (
  id uuid primary key default gen_random_uuid(),
  pub_id uuid references pubs (id) on delete set null,
  user_name text,
  score numeric not null check (score >= 0 and score <= 10),
  caption text,
  photo_url text not null,
  pint_type text not null,
  created_at timestamptz not null default now()
);

create index if not exists pints_created_at_idx on pints (created_at desc);
create index if not exists pints_pub_id_idx on pints (pub_id);

alter table pubs enable row level security;
alter table pints enable row level security;

drop policy if exists "Public read pubs" on pubs;
create policy "Public read pubs"
  on pubs for select
  using (true);

drop policy if exists "Public read pints" on pints;
create policy "Public read pints"
  on pints for select
  using (true);

drop policy if exists "Authenticated insert pints" on pints;
create policy "Authenticated insert pints"
  on pints for insert
  to authenticated
  with check (auth.uid() is not null);

-- Seed pub used by Playwright live e2e (local search for "Rosato")
insert into pubs (name, city, country, latitude, longitude)
select 'Rosato''s', 'Moville', 'Ireland', 55.1804, -7.0512
where not exists (
  select 1 from pubs where name = 'Rosato''s' and city = 'Moville'
);

-- Pint photo uploads (public read URLs, authenticated write)
insert into storage.buckets (id, name, public)
values ('pint-photos', 'pint-photos', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read pint photos" on storage.objects;
create policy "Public read pint photos"
  on storage.objects for select
  using (bucket_id = 'pint-photos');

drop policy if exists "Authenticated upload pint photos" on storage.objects;
create policy "Authenticated upload pint photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'pint-photos');
