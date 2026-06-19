-- Phase A/B: Google Places pub fields + account data purge RPC

alter table pubs
  add column if not exists google_place_id text,
  add column if not exists source text not null default 'seed';

create unique index if not exists pubs_google_place_id_uidx
  on pubs (google_place_id)
  where google_place_id is not null;

-- Enable RLS on pubs if not already (idempotent policies)
alter table pubs enable row level security;

drop policy if exists "Public read pubs" on pubs;
create policy "Public read pubs"
  on pubs for select
  using (true);

drop policy if exists "Authenticated insert pubs" on pubs;
create policy "Authenticated insert pubs"
  on pubs for insert
  with check (
    auth.uid() is not null
    and source in ('places', 'user')
  );

create table if not exists account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  user_email text,
  display_name text,
  pints_deleted integer not null default 0,
  requested_at timestamptz not null default now()
);

alter table account_deletion_requests enable row level security;

drop policy if exists "Users insert own deletion request" on account_deletion_requests;
create policy "Users insert own deletion request"
  on account_deletion_requests for insert
  with check (auth.uid() = user_id);

create or replace function purge_my_account_data()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  uname text;
  deleted_count integer;
  uemail text;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select coalesce(
    nullif(trim((auth.jwt() -> 'user_metadata' ->> 'display_name')), ''),
    split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1)
  ) into uname;

  uemail := auth.jwt() ->> 'email';

  delete from pints
  where user_id = uid
     or (user_id is null and user_name = uname);

  get diagnostics deleted_count = row_count;

  insert into account_deletion_requests (user_id, user_email, display_name, pints_deleted)
  values (uid, uemail, uname, deleted_count);

  return deleted_count;
end;
$$;

revoke all on function purge_my_account_data() from public;
grant execute on function purge_my_account_data() to authenticated;
