-- Product-driven drink discovery architecture (v1.0)

alter table products
  add column if not exists category text,
  add column if not exists country_of_origin text;

alter table products drop constraint if exists products_category_check;
alter table products add constraint products_category_check
check (
  category is null or category in (
    'stout', 'lager', 'cider', 'ale', 'ipa', 'porter',
    'wheat_beer', 'pilsner', 'alcohol_free', 'other'
  )
);

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

create table if not exists product_metrics (
  product_id uuid primary key references products(id) on delete cascade,
  search_count integer not null default 0,
  rating_count integer not null default 0,
  favourite_count integer not null default 0,
  updated_at timestamptz not null default now()
);

insert into product_metrics (product_id, rating_count)
select product_id, count(*)
from pints
where product_id is not null
group by product_id
on conflict (product_id)
do update set
  rating_count = excluded.rating_count,
  updated_at = now();

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

alter table product_regions enable row level security;
alter table product_metrics enable row level security;
alter table drink_suggestions enable row level security;

drop policy if exists "Public read product regions" on product_regions;
create policy "Public read product regions"
on product_regions for select
using (active = true);

drop policy if exists "Public read product metrics" on product_metrics;
create policy "Public read product metrics"
on product_metrics for select
using (true);

drop policy if exists "Signed-in users can suggest drinks" on drink_suggestions;
create policy "Signed-in users can suggest drinks"
on drink_suggestions for insert
to authenticated
with check (auth.uid() = submitted_by);

-- Backfill any pints still missing product_id after Phase 2
update pints p
set product_id = pr.id
from products pr
where p.product_id is null
  and (
    (p.pint_type = 'Guinness' and pr.slug = 'guinness')
    or (p.pint_type = 'Guinness 0.0' and pr.slug = 'guinness-00')
    or (p.pint_type = 'Beamish' and pr.slug = 'beamish')
    or (p.pint_type = 'Murphy''s' and pr.slug = 'murphys')
    or (p.pint_type = 'Other' and pr.slug = 'other')
  );
