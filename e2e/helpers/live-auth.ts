import { createClient } from '@supabase/supabase-js';
import type { Page } from '@playwright/test';

const PREVIEW_ORIGIN = 'http://127.0.0.1:4173';
const INBUCKET_BASE = process.env.SUPABASE_INBUCKET_URL ?? 'http://127.0.0.1:54324';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Live e2e requires ${name}`);
  }
  return value;
}

function adminClient() {
  return createClient(requireEnv('VITE_SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function livePreviewRedirect(path = '/profile'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${PREVIEW_ORIGIN}${normalized}`;
}

export async function createConfirmedTestUser(options?: { displayName?: string }) {
  const admin = adminClient();
  const email = `qa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@nicepints-test.local`;
  const displayName = options?.displayName ?? 'QA Bot';

  const { data: userData, error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });

  if (createError) {
    throw createError;
  }

  if (!userData.user) {
    throw new Error('Admin createUser returned no user');
  }

  return { email, userId: userData.user.id, displayName };
}

export async function signInViaMagicLink(
  page: Page,
  options?: { email?: string; displayName?: string; redirectPath?: string }
) {
  const admin = adminClient();
  const created = options?.email
    ? { email: options.email, displayName: options?.displayName ?? 'QA Bot', userId: '' }
    : await createConfirmedTestUser({ displayName: options?.displayName });

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: created.email,
    options: {
      redirectTo: livePreviewRedirect(options?.redirectPath ?? '/profile'),
    },
  });

  if (linkError) {
    throw linkError;
  }

  const actionLink = linkData.properties?.action_link;
  if (!actionLink) {
    throw new Error('generateLink returned no action_link');
  }

  await page.goto(actionLink);
  await page.waitForURL(/\/profile/, { timeout: 20_000 });

  return created;
}

type InbucketMessage = {
  id?: string;
  ID?: string;
};

async function readInbucketBody(email: string, messageId: string): Promise<string> {
  const mailbox = encodeURIComponent(email);
  const response = await fetch(`${INBUCKET_BASE}/api/v1/mailbox/${mailbox}/${messageId}`);
  if (!response.ok) {
    throw new Error(`Inbucket message fetch failed (${response.status})`);
  }

  return response.text();
}

export async function fetchLatestOtpFromInbucket(email: string, timeoutMs = 20_000): Promise<string> {
  const mailbox = encodeURIComponent(email);
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const listResponse = await fetch(`${INBUCKET_BASE}/api/v1/mailbox/${mailbox}`);
    if (listResponse.ok) {
      const messages = (await listResponse.json()) as InbucketMessage[];
      if (messages.length > 0) {
        const latest = messages[messages.length - 1];
        const messageId = latest.id ?? latest.ID;
        if (messageId) {
          const body = await readInbucketBody(email, messageId);
          const match = body.match(/\b(\d{6})\b/);
          if (match) {
            return match[1];
          }
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for OTP email to ${email}`);
}
