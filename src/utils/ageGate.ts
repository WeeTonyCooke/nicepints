const AGE_GATE_KEY = 'nicepints_age_confirmed_v1';

export function hasConfirmedAge(): boolean {
  try {
    return localStorage.getItem(AGE_GATE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function confirmAge(): void {
  try {
    localStorage.setItem(AGE_GATE_KEY, 'true');
  } catch {
    // Ignore storage failures — gate may reappear next visit.
  }
}
