import { test, expect } from '@playwright/test';
import { mockSignedIn, mockSupabasePopulated, skipAgeGate } from './helpers';
import { MOCK_PINTS } from './fixtures';

const MY_PINTS = MOCK_PINTS.filter((p) => p.user_name === 'Ant');

test.describe('Profile & my pints — QA-TEST-PLAN section 6', () => {
  test('R-01 stats show total pints, avg rating, pubs visited, countries', async ({ page }) => {
    await mockSupabasePopulated(page, MY_PINTS);
    await mockSignedIn(page);
    await skipAgeGate(page);
    await page.goto('/profile');
    await expect(page.getByText('1 pint logged')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Total Pints')).toBeVisible();
    await expect(page.getByText('Avg Rating')).toBeVisible();
    await expect(page.getByText('Pubs Visited')).toBeVisible();
    await expect(page.getByText('Countries', { exact: true })).toBeVisible();
  });

  test('R-02 my pints grid — tap navigates to pint detail', async ({ page }) => {
    await mockSupabasePopulated(page, MY_PINTS);
    await mockSignedIn(page);
    await skipAgeGate(page);
    await page.goto('/profile');
    await expect(page.getByText('1 pint logged')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('heading', { name: 'My Pints' }).scrollIntoViewIfNeeded();
    await page.locator('.grid.grid-cols-3 .cursor-pointer').first().click({ position: { x: 24, y: 24 } });
    await expect(page).toHaveURL('/pint/pint-1');
  });

  test('R-03 edit mode → delete → confirm → pint removed from feed', async ({ page }) => {
    await mockSupabasePopulated(page, MY_PINTS);
    await mockSignedIn(page);
    await skipAgeGate(page);

    await page.goto('/profile');
    await expect(page.getByText('1 pint logged')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByRole('button', { name: /Delete pint at/i }).click();

    await expect(page.getByRole('heading', { name: 'Delete this pint?' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete pint', exact: true }).last().click();

    await expect(page.getByRole('heading', { name: 'Delete this pint?' })).not.toBeVisible();
  });

  test('R-04 settings shows read-only email, rename field, and legal links', async ({ page }) => {
    await mockSupabasePopulated(page, []);
    await mockSignedIn(page);
    await skipAgeGate(page);
    await page.goto('/profile');

    await expect(page.getByText('Account email')).toBeVisible();
    await expect(page.getByText('tester@example.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Terms of Service' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Report a listing' })).toBeVisible();
  });

  test('R-04 delete account shows confirmation dialog with destructive copy', async ({ page }) => {
    await mockSupabasePopulated(page, []);
    await mockSignedIn(page);
    await skipAgeGate(page);
    await page.goto('/profile');

    await page.getByRole('button', { name: 'Delete account' }).click();
    await expect(page.getByRole('heading', { name: 'Delete your account?' })).toBeVisible();
    await expect(page.getByText(/permanently deletes all pints/i)).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Delete your account?' })).not.toBeVisible();
  });
});
