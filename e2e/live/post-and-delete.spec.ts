import { test, expect } from '@playwright/test';
import { skipAgeGate } from '../helpers';
import { signInViaMagicLink } from '../helpers/live-auth';
import { postSignedInPint } from '../helpers/live-flow';

test.describe('Live Supabase — post and delete', () => {
  test.beforeEach(async ({ page }) => {
    await skipAgeGate(page);
  });

  test('L-P07 signed-in post persists to real Supabase', async ({ page }) => {
    await signInViaMagicLink(page, { displayName: 'Poster Bot' });
    await postSignedInPint(page);

    await expect(page.getByRole('heading', { name: "Rosato's" })).toBeVisible({ timeout: 15_000 });
  });

  test('L-R03 delete removes pint from profile and feed', async ({ page }) => {
    const { displayName } = await signInViaMagicLink(page, { displayName: 'Delete Bot' });
    await postSignedInPint(page);

    await page.goto('/profile');
    await expect(page.getByText('1 pint logged')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Delete pint at/i }).click();

    await expect(page.getByRole('heading', { name: 'Delete this pint?' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete pint', exact: true }).last().click();
    await expect(page.getByRole('heading', { name: 'Delete this pint?' })).not.toBeVisible();

    await page.goto('/');
    await expect(page.getByText('No pints yet')).toBeVisible({ timeout: 15_000 });
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: displayName })).toBeVisible();
    await expect(page.getByText('No pints logged yet')).toBeVisible();
  });

  test('L-SMOKE sign in → log pint → Find → delete', async ({ page }) => {
    await signInViaMagicLink(page, { displayName: 'Smoke Bot' });
    await postSignedInPint(page);

    await page.goto('/map');
    await expect(page.getByRole('heading', { name: 'Find a Pour' })).toBeVisible();
    await page.getByRole('button', { name: 'All pours' }).click();
    await expect(page.getByRole('heading', { name: "Rosato's" })).toBeVisible({ timeout: 15_000 });

    await page.goto('/profile');
    await expect(page.getByText('1 pint logged')).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Delete pint at/i }).click();
    await page.getByRole('button', { name: 'Delete pint', exact: true }).last().click();

    await page.goto('/map');
    await page.getByRole('button', { name: 'All pours' }).click();
    await expect(page.getByText('No matching pours yet')).toBeVisible({ timeout: 15_000 });
  });
});
