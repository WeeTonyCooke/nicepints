import { test, expect } from '@playwright/test';
import { mockSupabaseEmpty, mockSupabasePopulated, skipAgeGate } from './helpers';
import { MOCK_PINTS } from './fixtures';

test.describe('Feed & detail — QA-TEST-PLAN section 4', () => {
  test('F-01 home feed loads with photo-first cards and Top pint hero', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Nice Pints/i })).toBeVisible();
    await expect(page.getByText('Recent Pours')).not.toBeVisible();
    await expect(page.getByText('Top pint')).toBeVisible();
    await expect(page.getByRole('heading', { name: "Rosato's" })).toBeVisible();
    await expect(page.getByText("Susie's")).toBeVisible();
    await expect(page.getByText("Keogh's")).toBeVisible();
  });

  test('F-01 empty feed shows empty state, not an error', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/');

    await expect(page.getByText('Find a great pint near you.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Find a Pint' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Rate a Pint' })).toBeVisible();
  });

  test('F-02 pour label shows pint type and serving when known', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/');

    await expect(page.getByText('Guinness 0.0 · On draught')).toBeVisible();
  });

  test('F-03 pint detail shows photo, score, pub, note, author, report button', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/pint/pint-1');

    await expect(page.getByRole('heading', { name: "Rosato's" })).toBeVisible();
    await expect(page.getByText('9.0/10')).toBeVisible();
    await expect(page.getByText('Perfect settle, no rush.')).toBeVisible();
    await expect(page.getByText('Ant')).toBeVisible();
    await expect(page.getByRole('button', { name: /report/i })).toBeVisible();
  });

  test('F-04 pub detail shows pub info, pint grid, and add-pint CTA with pubId', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/pub/pub-rosatos');

    await expect(page.getByRole('heading', { name: "Rosato's" })).toBeVisible();
    await expect(page.getByText('Moville')).toBeVisible();

    const addPintCta = page.getByRole('button', { name: 'Rate a Pint Here' });
    await expect(addPintCta).toBeVisible();
    await addPintCta.click();
    await expect(page).toHaveURL(/\/add\?pubId=pub-rosatos/);
  });

  test('F-04 pub with no pints shows empty state', async ({ page }) => {
    await mockSupabasePopulated(page, []);
    await skipAgeGate(page);
    await page.goto('/pub/pub-rosatos');

    await expect(page.getByText('No pints logged here yet.')).toBeVisible();
  });

  test('F-05 signed-out user sees sign-in prompt in report dialog', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/pint/pint-1');

    await page.getByRole('button', { name: 'Report' }).click();
    await expect(page.getByText('Sign in to report inappropriate content.')).toBeVisible();
  });

  test('F-06 network failure on feed shows retry UI', async ({ page }) => {
    await skipAgeGate(page);
    await page.route('**/rest/v1/pints*', (route) => route.abort('failed'));
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible({ timeout: 15_000 });
  });

  test('F-06 retry button re-issues the request', async ({ page }) => {
    await skipAgeGate(page);
    let attempt = 0;

    await page.route('**/rest/v1/pints*', async (route) => {
      attempt += 1;
      if (attempt === 1) {
        await route.abort('failed');
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PINTS),
      });
    });

    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByText('Top pint')).toBeVisible();
  });
});
