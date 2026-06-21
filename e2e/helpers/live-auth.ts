import { createClient } from '@supabase/supabase-js';
import { expect, type Page } from '@playwright/test';

const PREVIEW_ORIGIN = 'http://127.0.0.1:4173';

function mailpitBaseUrl(): string {
  const configured =
    process.env.SUPABASE_INBUCKET_URL ||
    process.env.MAILPIT_URL ||
    'http://127.0.0.1:54324';

  return configured.replace(/\/$/, '');
}

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
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible({ timeout: 20_000 });

  return created;
}

type MailpitMessageSummary = {
  ID: string;
  Subject?: string;
  Created?: string;
  To?: Array<{ Address?: string }>;
};

type MailpitMessage = {
  Subject?: string;
  Text?: string;
  HTML?: string;
  To?: Array<{ Address?: string }>;
};

function extractOtp(content: string): string | null {
  const signInCode = content.match(/Sign In Code:\s*(\d{6})/i);
  if (signInCode?.[1]) {
    return signInCode[1];
  }

  const labeledCode = content.match(/(?:code|token|otp|verification)[:\s]*(\d{6})/i);
  if (labeledCode?.[1]) {
    return labeledCode[1];
  }

  const spacedDigits = content.match(/(?:^|\s)(\d(?:\s*\d){5})(?:\s|$)/);
  if (spacedDigits?.[1]) {
    return spacedDigits[1].replace(/\s/g, '');
  }

  const generic = content.match(/\b(\d{6})\b/);
  return generic?.[1] ?? null;
}

async function readMailpitMessage(messageId: string): Promise<MailpitMessage> {
  const response = await fetch(`${mailpitBaseUrl()}/api/v1/message/${messageId}`);
  if (!response.ok) {
    const body = await response.text().catch(() => '<no body>');
    console.debug('[e2e] readMailpitMessage failed', response.status, body);
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

function messageMatchesRecipient(message: MailpitMessageSummary | MailpitMessage, email: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();
  return (message.To ?? []).some((recipient) => recipient.Address?.trim().toLowerCase() === normalizedEmail);
}

function messageSentAfter(message: MailpitMessageSummary, sentAfterMs?: number): boolean {
  if (!sentAfterMs || !message.Created) {
    return true;
  }

  return new Date(message.Created).getTime() >= sentAfterMs - 5_000;
}

async function listMailpitMessages(): Promise<MailpitMessageSummary[]> {
  const response = await fetch(`${mailpitBaseUrl()}/api/v1/messages?limit=50`);
  if (!response.ok) {
    const body = await response.text().catch(() => '<no body>');
    console.debug('[e2e] listMailpitMessages failed', response.status, body);
    return [];
  }

  const data = (await response.json()) as { messages?: MailpitMessageSummary[] };
  return data.messages ?? [];
}

async function fetchOtpFromMailpit(email: string, sentAfterMs?: number): Promise<string | null> {
  const summaries = await listMailpitMessages();

  for (const summary of summaries) {
    if (!messageMatchesRecipient(summary, email) || !messageSentAfter(summary, sentAfterMs)) {
      continue;
    }

    const message = await readMailpitMessage(summary.ID);
    const otp = otpFromMessage(message);
    if (otp) {
      return otp;
    }
  }

  const searchQuery = encodeURIComponent(`to:${email}`);
  const searchResponse = await fetch(`${mailpitBaseUrl()}/api/v1/search?query=${searchQuery}&limit=5`);
  if (searchResponse.ok) {
    const data = (await searchResponse.json()) as { messages?: MailpitMessageSummary[] };
    for (const summary of data.messages ?? []) {
      if (!messageSentAfter(summary, sentAfterMs)) {
        continue;
      }

      const message = await readMailpitMessage(summary.ID);
      const otp = otpFromMessage(message);
      if (otp) {
        return otp;
      }
    }
  }

  return null;
}

export async function fetchLatestOtpFromInbucket(
  email: string,
  timeoutMs = 60_000,
  sentAfterMs?: number
): Promise<string> {
  const base = mailpitBaseUrl();
  console.debug('[e2e] Mailpit base URL:', base);
  const deadline = Date.now() + timeoutMs;
  let lastMessageCount = -1;

  while (Date.now() < deadline) {
    try {
      const summaries = await listMailpitMessages();
      if (summaries.length !== lastMessageCount) {
        lastMessageCount = summaries.length;
        console.debug('[e2e] Mailpit messages:', lastMessageCount);
      }

      const otp = await fetchOtpFromMailpit(email, sentAfterMs);
      if (otp) {
        return otp;
      }
    } catch (err) {
      console.debug('[e2e] fetchOtpFromMailpit error:', err);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for OTP email to ${email} (mailpit: ${base})`);
}
