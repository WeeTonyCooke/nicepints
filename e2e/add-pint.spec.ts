import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  mockStorageUpload,
  mockSupabaseEmpty,
  mockSupabasePopulated,
  mockSignedIn,
  skipAgeGate,
} from './helpers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_PHOTO = path.join(__dirname, 'fixtures-photo.jpg');

async function selectPubFromSearch(page: import('@playwright/test').Page, query: string) {
  await page.getByPlaceholder('Search pub or bar').fill(query);
  await expect(page.getByRole('button', { name: new RegExp(query, 'i') })).toBeVisible({
    timeout: 10_000,
  });
  await page.getByText("Rosato's", { exact: true }).click();
  await expect(page.getByText(/Selected: Rosato/i)).toBeVisible({ timeout: 10_000 });
}

test.describe('Log a pint — QA-TEST-PLAN section 3', () => {
  test('P-01 post button disabled until photo, rating, and pub are set', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    await expect(page.getByRole('heading', { name: 'Log a Pint' })).toBeVisible();
    await page.getByRole('button', { name: 'Serious' }).click();
    await expect(page.getByRole('button', { name: /Select a pub to post|Add a photo to post/i })).toBeDisabled();
  });

  test('P-02 cannot post without a photo', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    await page.getByRole('button', { name: 'Great' }).click();
    await expect(page.getByRole('button', { name: 'Add a photo to post' })).toBeDisabled();
  });

  test('P-03 rating grid 1-10', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    await page.getByRole('button', { name: 'Serious' }).click();
    await page.getByRole('button', { name: 'Exceptional' }).click();
    await expect(page.getByRole('button', { name: 'Exceptional' })).toHaveClass(/bg-gold/);
  });

  test('P-05/P-06 Guinness 0.0 requires a serving type before posting', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    await page.getByRole('button', { name: 'Guinness', exact: true }).click();
    await page.getByText('Guinness 0.0', { exact: true }).click();

    await expect(page.getByText('How was it served?')).toBeVisible();
    await expect(page.getByRole('button', { name: 'On draught' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'can', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Bottle' })).not.toBeVisible();
  });

  test('P-04 pub selection shows search (not legacy city/pub dropdowns)', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    await expect(page.getByPlaceholder('Search pub or bar')).toBeVisible();
    await expect(page.getByText(/Sign in from your profile/i)).not.toBeVisible();
  });

  test('P-01/P-07 signed-in post with photo redirects to feed', async ({ page }) => {
    await mockSupabasePopulated(page);
    await mockSignedIn(page);
    await mockStorageUpload(page);
    await skipAgeGate(page);

    await page.goto('/add');
    await selectPubFromSearch(page, 'Rosato');

    await page.getByRole('button', { name: 'Serious' }).click();
    await page.setInputFiles('input[type="file"]', TEST_PHOTO);

    await expect(page.getByRole('button', { name: 'Post Pint' })).toBeEnabled({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Post Pint' }).click();
    await expect(page).toHaveURL('/');
  });

  test('P-01 post-time auth sheet opens when signed out with all fields ready', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);

    await page.goto('/add');
    await selectPubFromSearch(page, 'Rosato');
    await page.getByRole('button', { name: 'Great' }).click();
    await page.setInputFiles('input[type="file"]', TEST_PHOTO);

    await expect(page.getByRole('button', { name: 'Sign in to post' })).toBeEnabled({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Sign in to post' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in to post' })).toBeVisible();
  });
});
