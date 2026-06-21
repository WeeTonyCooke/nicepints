const TIP_KEYS = {
  'add-pint-photo': 'nicepints_tip_add_pint_photo_v1',
  'pub-search-miss': 'nicepints_tip_pub_search_miss_v1',
  'map-first-visit': 'nicepints_tip_map_first_visit_v1',
} as const;

export type ContextualTipId = keyof typeof TIP_KEYS;

export function hasSeenContextualTip(id: ContextualTipId): boolean {
  try {
    return localStorage.getItem(TIP_KEYS[id]) === 'true';
  } catch {
    return false;
  }
}

export function dismissContextualTip(id: ContextualTipId): void {
  try {
    localStorage.setItem(TIP_KEYS[id], 'true');
  } catch {
    // Ignore storage failures — tip may reappear next visit.
  }
}

export function allContextualTipStorageKeys(): string[] {
  return Object.values(TIP_KEYS);
}
