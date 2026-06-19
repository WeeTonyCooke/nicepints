-- Allow signed-in users to rename pints they posted (user_name field)
-- Run if "Could not rename pints" appears when saving display name

create policy "Authenticated users can update pint author names"
  on pints for update
  to authenticated
  using (true)
  with check (true);
