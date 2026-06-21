-- Profile trust signal (consensus agreement + favourites). See docs/PROFILE-TRUST-SIGNAL-SPEC.md

create table if not exists user_trust_signal (
  user_id uuid primary key references auth.users (id) on delete cascade,
  agreement_score numeric,
  resolved_rating_count integer not null default 0,
  favourite_count integer not null default 0,
  is_recognized boolean not null default false,
  last_computed_at timestamptz not null default now()
);

alter table user_trust_signal enable row level security;

drop policy if exists "Public read trust signal" on user_trust_signal;
create policy "Public read trust signal"
  on user_trust_signal for select
  using (true);

create table if not exists profile_favourites (
  id uuid primary key default gen_random_uuid(),
  favourited_by uuid not null references auth.users (id) on delete cascade,
  favourited_user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (favourited_by, favourited_user_id),
  check (favourited_by != favourited_user_id)
);

create index if not exists profile_favourites_favourited_user_id_idx
  on profile_favourites (favourited_user_id);

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

-- Weighted consensus for ratings posted after a given time (90-day linear decay).
create or replace function public.weighted_pint_score_consensus(
  p_pub_id uuid,
  p_product_id uuid,
  p_serving_type text,
  p_after timestamptz,
  p_exclude_user_id uuid
)
returns numeric
language sql
stable
set search_path = public
as $$
  select coalesce(
    sum(p.score * greatest(0, 1 - (extract(epoch from (now() - p.created_at)) / 86400.0 / 90.0)))
    / nullif(
      sum(greatest(0, 1 - (extract(epoch from (now() - p.created_at)) / 86400.0 / 90.0))),
      0
    ),
    0
  )
  from pints p
  where p.pub_id = p_pub_id
    and p.product_id = p_product_id
    and p.serving_type = p_serving_type
    and p.created_at > p_after
    and p.user_id is distinct from p_exclude_user_id
    and p.user_id is not null;
$$;

-- Recompute all user trust signals (run daily via Supabase cron / manual service role call).
create or replace function public.recompute_user_trust_signals()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_resolved_count integer;
  v_agreement_sum numeric;
  v_agreement_score numeric;
  v_favourite_count integer;
  v_agreement_threshold numeric;
  v_min_resolved integer;
  v_is_recognized boolean;
  v_rating record;
  v_other_count integer;
  v_consensus numeric;
  v_agreement numeric;
  consensus_min_others constant integer := 3;
  base_min_resolved constant integer := 5;
  base_agreement_threshold constant numeric := 0.75;
begin
  for v_user_id in
    select distinct user_id from pints where user_id is not null
    union
    select distinct favourited_user_id from profile_favourites
  loop
    select coalesce(count(*), 0) into v_favourite_count
    from profile_favourites
    where favourited_user_id = v_user_id;

    v_resolved_count := 0;
    v_agreement_sum := 0;

    for v_rating in
      select id, score, pub_id, product_id, serving_type, created_at
      from pints
      where user_id = v_user_id
        and pub_id is not null
        and product_id is not null
        and serving_type is not null
    loop
      select count(*) into v_other_count
      from pints o
      where o.pub_id = v_rating.pub_id
        and o.product_id = v_rating.product_id
        and o.serving_type = v_rating.serving_type
        and o.user_id is distinct from v_user_id
        and o.user_id is not null
        and o.created_at > v_rating.created_at;

      if v_other_count < consensus_min_others then
        continue;
      end if;

      v_consensus := public.weighted_pint_score_consensus(
        v_rating.pub_id,
        v_rating.product_id,
        v_rating.serving_type,
        v_rating.created_at,
        v_user_id
      );

      v_agreement := 1 - (abs(v_rating.score - v_consensus) / 10.0);
      v_agreement := greatest(0, least(1, v_agreement));

      v_resolved_count := v_resolved_count + 1;
      v_agreement_sum := v_agreement_sum + v_agreement;
    end loop;

    if v_resolved_count > 0 then
      v_agreement_score := v_agreement_sum / v_resolved_count;
    else
      v_agreement_score := null;
    end if;

    -- Option A: favourites lower the recognition bar slightly (not a separate path).
    v_agreement_threshold := greatest(
      0.65,
      base_agreement_threshold - least(0.10, v_favourite_count * 0.002)
    );
    v_min_resolved := greatest(3, base_min_resolved - (v_favourite_count / 10));

    v_is_recognized := v_resolved_count >= v_min_resolved
      and v_agreement_score is not null
      and v_agreement_score >= v_agreement_threshold;

    insert into user_trust_signal (
      user_id,
      agreement_score,
      resolved_rating_count,
      favourite_count,
      is_recognized,
      last_computed_at
    )
    values (
      v_user_id,
      v_agreement_score,
      v_resolved_count,
      v_favourite_count,
      v_is_recognized,
      now()
    )
    on conflict (user_id) do update set
      agreement_score = excluded.agreement_score,
      resolved_rating_count = excluded.resolved_rating_count,
      favourite_count = excluded.favourite_count,
      is_recognized = excluded.is_recognized,
      last_computed_at = excluded.last_computed_at;
  end loop;
end;
$$;

revoke all on function public.recompute_user_trust_signals() from public;
grant execute on function public.recompute_user_trust_signals() to service_role;

-- Daily schedule (enable pg_cron in Supabase dashboard if not already):
-- select cron.schedule(
--   'recompute-user-trust-signals',
--   '0 3 * * *',
--   $$select public.recompute_user_trust_signals()$$
-- );

grant select on table public.user_trust_signal to anon, authenticated;
grant select on table public.profile_favourites to anon, authenticated;
grant insert, delete on table public.profile_favourites to authenticated;
grant all on table public.user_trust_signal to service_role;
grant all on table public.profile_favourites to service_role;
