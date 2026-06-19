import type { Page } from '@playwright/test';

const AGE_GATE_KEY = 'nicepints_age_confirmed_v1';

/** Skip age gate for tests that don't cover L-01 */
export async function skipAgeGate(page: Page) {
  await page.addInitScript((key) => {
    localStorage.setItem(key, 'true');
  }, AGE_GATE_KEY);
}

/** Empty Supabase REST responses — lets UI render without real backend (CI-safe). */
export async function mockSupabaseEmpty(page: Page) {
  await page.route('**/rest/v1/**', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '[]',
      });
      return;
    }

    await route.continue();
  });

  await page.route('**/auth/v1/**', async (route) => {
    if (route.request().url().includes('token')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access_token: null, user: null }),
      });
      return;
    }

    await route.continue();
  });
}
