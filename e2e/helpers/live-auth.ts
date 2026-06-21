import { createClient } from '@supabase/supabase-js';
import type { Page } from '@playwright/test';

const PREVIEW_ORIGIN = 'http://127.0.0.1:4173';
const MAILPIT_BASE =
  process.env.SUPABASE_INBUCKET_URL ??
  process.env.MAILPIT_URL ??
  'http://127.0.0.1:54324';

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

type MailpitMessageSummary = {
  ID: string;
  Subject?: string;
};

type MailpitMessage = {
  Subject?: string;
  Text?: string;
  HTML?: string;
};

function extractOtp(content: string): string | null {
  const signInCode = content.match(/Sign In Code:\s*(\d{6})/i);
  if (signInCode?.[1]) {
    return signInCode[1];
  }

  const generic = content.match(/\b(\d{6})\b/);
  return generic?.[1] ?? null;
}

async function readMailpitMessage(messageId: string): Promise<MailpitMessage> {
  const response = await fetch(`${MAILPIT_BASE}/api/v1/message/${messageId}`);
  if (!response.ok) {
    throw new Error(`Mailpit message fetch failed (${response.status})`);
  }

  return response.json() as Promise<MailpitMessage>;
}

function otpFromMessage(message: MailpitMessage): string | null {
  return (
    extractOtp(message.Subject ?? '') ??
    extractOtp(message.Text ?? '') ??
    extractOtp(message.HTML ?? '')
  );
}

async function fetchOtpFromMailpit(email: string): Promise<string | null> {
  const searchQuery = encodeURIComponent(`to:${email}`);
  const searchResponse = await fetch(`${MAILPIT_BASE}/api/v1/search?query=${searchQuery}&limit=5`);
  if (searchResponse.ok) {
    const data = (await searchResponse.json()) as { messages?: MailpitMessageSummary[] };
    const summaries = data.messages ?? [];
    for (const summary of [...summaries].reverse()) {
      const message = await readMailpitMessage(summary.ID);
      const otp = otpFromMessage(message);
      if (otp) {
        return otp;
      }
    }
  }

  const latestResponse = await fetch(`${MAILPIT_BASE}/api/v1/message/latest`);
  if (!latestResponse.ok) {
    return null;
  }

  const latest = (await latestResponse.json()) as MailpitMessage;
  return otpFromMessage(latest);
}

export async function fetchLatestOtpFromInbucket(email: string, timeoutMs = 20_000): Promise<string> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const otp = await fetchOtpFromMailpit(email);
    if (otp) {
      return otp;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for OTP email to ${email}`);
}
