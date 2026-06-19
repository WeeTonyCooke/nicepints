-- Phase 2: discovery foundation — products, serving type, Guinness 0.0

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  brand text,
  is_non_alcoholic boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into products (slug, name, brand, is_non_alcoholic)
values
  ('guinness', 'Guinness', 'Guinness', false),
  ('guinness-00', 'Guinness 0.0', 'Guinness', true),
  ('beamish', 'Beamish', 'Beamish', false),
  ('murphys', 'Murphy''s', 'Murphy''s', false),
  ('other', 'Other', null, false)
on conflict (slug) do nothing;

alter table pints add column if not exists serving_type text not null default 'unknown';
alter table pints add column if not exists product_id uuid references products (id) on delete set null;

alter table pints drop constraint if exists pints_serving_type_check;
alter table pints add constraint pints_serving_type_check
  check (serving_type in ('draught', 'can', 'bottle', 'unknown'));

create index if not exists pints_product_serving_idx
  on pints (product_id, serving_type, created_at desc);

create index if not exists pints_pint_type_serving_idx
  on pints (pint_type, serving_type, created_at desc);

-- Link existing rows to products (pint_type string is still used in the app)
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

-- Legacy Guinness rows: assume draught unless we know otherwise
update pints
set serving_type = 'draught'
where serving_type = 'unknown'
  and pint_type in ('Guinness', 'Beamish', 'Murphy''s');
