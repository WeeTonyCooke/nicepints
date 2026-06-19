# Supabase Auth Setup

Calm, honest sign-in — see [DESIGN-PRINCIPLES.md](./DESIGN-PRINCIPLES.md) (#1 Clarity, #7 Honest design).

---

## Finish the email template (do this once)

### 1. Open Supabase

[Dashboard](https://supabase.com/dashboard) → **NicePints** project → **Authentication** → **Email Templates** → **Magic Link**

### 2. Paste the template

Copy everything from:

**`supabase/email-templates/magic-link.html`**

Or paste directly:

```html
<h2 style="font-family: Georgia, serif; color: #1a1a1a;">Sign in to NicePints</h2>

<p style="font-family: -apple-system, sans-serif; color: #444; font-size: 15px;">
  Use this code in the app, or tap the link below.
</p>

<p style="font-family: -apple-system, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #1a1a1a; margin: 24px 0;">
  {{ .Token }}
</p>

<p style="font-family: -apple-system, sans-serif; color: #444; font-size: 15px;">
  <a href="{{ .ConfirmationURL }}" style="color: #c9a227; font-weight: 600; text-decoration: none;">Log in to NicePints</a>
</p>

<p style="font-family: -apple-system, sans-serif; color: #999; font-size: 12px; margin-top: 32px;">
  Code expires in about an hour. If you didn't request this, ignore this email.
</p>
```

### 3. Save

Click **Save** in the template editor.

### 4. URL configuration

**Authentication** → **URL Configuration**:

| Setting | Value |
|---------|--------|
| Site URL | `https://nicepints.com` |
| Redirect URLs | `https://nicepints.com/**`, `http://localhost:3000/**` |

For local dev only, Site URL can stay `http://localhost:3000` — production must include the Netlify domain.

---

## Sign in (after template is saved)

1. `npm run dev` — keep running at **http://localhost:3000**
2. Profile → email + display name → **Send sign-in email**
3. Email shows **6-digit code** and **Log in** link
4. Either:
   - Enter code → **Verify with code**, or
   - Click **Log in** in email (app must be running)

---

## "Email rate limit exceeded"

**This is not fixed by clearing database tables.** Supabase limits how many auth emails can be sent per hour (especially on the free tier).

### What to do

1. **Stop tapping Resend** — each attempt counts toward the limit.
2. **Wait ~1 hour** for the limit to reset.
3. **Use your last email** — if you already received a "Log in" link or code, try that first (valid ~1 hour).
4. Send **one** fresh email after the wait.

### Optional: clean up test auth users

Only if you want to remove duplicate test accounts — **does not reset rate limit**:

Run in **SQL Editor**: `supabase/scripts/cleanup-test-auth.sql`

```sql
-- See users
select id, email, created_at from auth.users order by created_at desc;

-- Delete one test user (uncomment and edit email)
-- delete from auth.users where email = 'anthonymcg@gmail.com';
```

To wipe all dev users (careful):

```sql
-- delete from auth.users;
```

---

## iOS / Capacitor

On device, prefer the **6-digit code** in Profile. Magic links need deep links later (Phase 6).

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| No code in email | Save Magic Link template with `{{ .Token }}` |
| Rate limit exceeded | Wait ~1 hour; use last email; don't spam Resend |
| `localhost refused to connect` | Run `npm run dev` before clicking link |
| Invalid or expired code | Request one new email after rate limit clears |
| Link works but not signed in | Add `http://localhost:3000/**` to Redirect URLs |

---

## Status checklist

- [x] Magic Link template saved with `{{ .Token }}`
- [x] Site URL includes `https://nicepints.com`
- [x] Redirect URLs include `https://nicepints.com/**` and `http://localhost:3000/**`
- [x] Test sign-in successful (magic link — A-02 pass 2025-06-19)
- [x] OTP code visible in email (6-digit code + NicePints heading — confirmed 2026-06-17)
