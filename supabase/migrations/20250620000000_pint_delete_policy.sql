-- Allow signed-in users to delete pints they posted (matched by name on pints)

create policy "Users can delete own pints"
  on pints for delete
  to authenticated
  using (
    user_name is not null
    and trim(user_name) = coalesce(
      nullif(trim((auth.jwt() -> 'user_metadata' ->> 'display_name')), ''),
      split_part(coalesce(auth.jwt() ->> 'email', ''), '@', 1)
    )
  );
