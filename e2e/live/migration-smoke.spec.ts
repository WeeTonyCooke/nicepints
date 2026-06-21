import { test, expect } from '@playwright/test';
import { skipAgeGate } from '../helpers';

/**
 * Integration checks against a real local Supabase (migrations applied, no route mocks).
 * Run via `npm run test:e2e:live` after `supabase db reset --local`.
 */
test.describe('Live Supabase — migration-backed API', () => {
  test.beforeEach(async ({ page }) => {
    await skipAgeGate(page);
  });

  test('L-S01 Add Pint loads active products from real Supabase', async ({ page }) => {
    await page.goto('/add');
    await expect(page.getByText('Loading drinks...')).not.toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'Guinness', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Guinness 0.0', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Beamish', exact: true })).toBeVisible();
  });

  test('L-S02 empty database shows feed empty state', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Find a great pint near you.')).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'Find a Pint' })).toBeVisible();
  });

  test('L-S03 products REST returns 13 active rows with public read RLS', async ({ request }) => {
    const baseURL = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!baseURL || !anonKey) {
      throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    }

    const response = await request.get(`${baseURL}/rest/v1/products?select=slug&active=eq.true`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const rows = (await response.json()) as Array<{ slug: string }>;
    expect(rows.length).toBe(13);
    expect(rows.some((row) => row.slug === 'guinness-00')).toBeTruthy();
  });
});
