import type { User } from '@supabase/supabase-js';

const PENDING_DISPLAY_NAME_KEY = 'nicepints_pending_display_name';

export function getDisplayName(user: User | null): string | null {
  if (!user) {
    return null;
  }

  const metadataName = user.user_metadata?.display_name;
  if (typeof metadataName === 'string' && metadataName.trim()) {
    return metadataName.trim();
  }

  const emailPrefix = user.email?.split('@')[0];
  return emailPrefix?.trim() || null;
}

export function hasCustomDisplayName(user: User | null): boolean {
  const metadataName = user?.user_metadata?.display_name;
  return typeof metadataName === 'string' && metadataName.trim().length > 0;
}

export function getEmailPrefix(user: User | null): string | null {
  const prefix = user?.email?.split('@')[0];
  return prefix?.trim() || null;
}

/** Plain name for feed attribution — no @ prefix (BFM: utility app, not social). */
export function formatAuthorName(name: string): string {
  return name.trim().replace(/^@+/, '');
}

export function savePendingDisplayName(name: string): void {
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }
  try {
    sessionStorage.setItem(PENDING_DISPLAY_NAME_KEY, trimmed);
  } catch {
    // Ignore storage failures.
  }
}

export function getPendingDisplayName(): string | null {
  try {
    return sessionStorage.getItem(PENDING_DISPLAY_NAME_KEY);
  } catch {
    return null;
  }
}

export function clearPendingDisplayName(): void {
  try {
    sessionStorage.removeItem(PENDING_DISPLAY_NAME_KEY);
  } catch {
    // Ignore storage failures.
  }
}
