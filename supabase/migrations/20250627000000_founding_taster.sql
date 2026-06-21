-- Founding Taster flag (manual invite-only). See docs/FOUNDING-TASTER-SPEC.md

alter table user_trust_signal
  add column if not exists is_founding_taster boolean not null default false;

-- Set manually in Supabase dashboard, e.g.:
-- insert into user_trust_signal (user_id, is_founding_taster)
-- values ('<auth-user-uuid>', true)
-- on conflict (user_id) do update set is_founding_taster = true;
