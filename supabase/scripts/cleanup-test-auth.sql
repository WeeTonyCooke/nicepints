-- Optional: reset test auth data during development
-- ⚠️  Does NOT fix "email rate limit exceeded" — that resets on its own (~1 hour).
-- ⚠️  Only run in dev. This deletes users and their auth sessions.

-- 1. See who exists
select id, email, created_at, last_sign_in_at
from auth.users
order by created_at desc;

-- 2. Delete a single test user by email (safer)
-- delete from auth.users where email = 'your-test@email.com';

-- 3. Nuclear option: delete ALL auth users (dev only)
-- delete from auth.users;

-- App tables are separate — only clear these if you want a fresh slate:

-- delete from pint_reports;
-- delete from pub_requests;
-- delete from pints;
-- delete from pubs;

-- After cleanup: wait for rate limit to clear, then send ONE new sign-in email.
