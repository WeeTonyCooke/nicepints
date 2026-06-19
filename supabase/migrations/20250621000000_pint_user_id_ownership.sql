-- Reliable pint ownership via user_id (fixes profile delete)

alter table pints add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists pints_user_id_idx on pints (user_id);

drop policy if exists "Users can delete own pints" on pints;

create policy "Users can delete own pints"
  on pints for delete
  to authenticated
  using (
    auth.uid() = user_id
    or (
      user_id is null
      and user_name is not null
      and lower(trim(user_name)) = lower(
        coalesce(
          nullif(trim(auth.jwt() -> 'user_metadata' ->> 'display_name'), ''),
          split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1)
        )
      )
    )
  );
