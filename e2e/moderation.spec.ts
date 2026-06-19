import { test, expect } from '@playwright/test';
import { mockSupabaseEmpty, mockSupabasePopulated, mockSignedIn, skipAgeGate } from './helpers';

test.describe('Moderation & crowdsourcing — QA-TEST-PLAN section 7', () => {
  test('M-01 report listing form submits to pub_requests (guest)', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);

    let posted = false;
    await page.route('**/rest/v1/pub_requests*', async (route) => {
      if (route.request().method() === 'POST') {
        posted = true;
        await route.fulfill({ status: 201, contentType: 'application/json', body: '[{}]' });
        return;
      }
      await route.continue();
    });

    await page.goto('/request-pub');
    await page.getByPlaceholder("e.g. O'Donoghue's").fill('The Anchor Bar');
    await page.getByPlaceholder('e.g. Dublin').fill('Moville');
    await page.getByPlaceholder('you@example.com').fill('guest@example.com');
    await page.getByRole('button', { name: 'Submit report' }).click();

    await expect(page.getByRole('heading', { name: 'Report received' })).toBeVisible();
    expect(posted).toBe(true);
  });

  test('M-02 signed-in user can submit a pint report', async ({ page }) => {
    await mockSupabasePopulated(page);
    await mockSignedIn(page);
    await skipAgeGate(page);

    await page.goto('/pint/pint-1');
    await page.getByRole('button', { name: 'Report' }).click();
    await expect(page.getByRole('heading', { name: 'Report this pint' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit report' }).evaluate((button) => {
      (button as HTMLButtonElement).click();
    });

    await expect(page.getByText(/we'll review this report/i)).toBeVisible();
  });
});
