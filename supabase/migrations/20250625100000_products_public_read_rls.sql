-- Fix: products table must be readable by the app (anon + authenticated).
-- Without this, REST returns [] for /products and product joins come back null,
-- so Add Pint cannot load the drink list even when rows exist.

alter table products enable row level security;

drop policy if exists "Public read active products" on products;
create policy "Public read active products"
on products for select
using (active = true);
