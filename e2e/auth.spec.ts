import { test, expect } from '@playwright/test';
import { mockSupabaseEmpty, mockSignedIn, skipAgeGate } from './helpers';

test.describe('First launch & compliance — QA-TEST-PLAN section 1', () => {
  test('L-01 age gate shows on first launch', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await page.getByRole('button', { name: 'I meet the legal age' }).click();

    await expect(page.getByRole('heading', { name: 'Welcome' })).not.toBeVisible();
    await expect(
      page.getByText('Find a great pint near you.').or(page.getByText('Top pint'))
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Authentication & identity — QA-TEST-PLAN section 2', () => {
  test('A-01 sign-in form loads with email, name, and send-code button', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/profile');

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Name on pints')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send sign-in email' })).toBeVisible();
  });

  test('A-01 sending code shows confirmation and reveals code field', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);

    await page.goto('/profile');
    await page.getByLabel('Email').fill('tester@example.com');
    await page.getByLabel('Name on pints').fill('Ant');
    await page.getByRole('button', { name: 'Send sign-in email' }).click();

    await expect(page.getByText('Check your email.', { exact: true })).toBeVisible();
    await expect(page.locator('#sign-in-code')).toBeVisible();
  });

  test('A-04/A-05/A-06 signed-in profile shows display name on header, email only in settings', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await mockSignedIn(page);
    await skipAgeGate(page);
    await page.goto('/profile');

    await expect(page.getByRole('heading', { name: 'Ant' })).toBeVisible();

    const header = page.locator('header').first();
    await expect(header.getByText('tester@example.com')).not.toBeVisible();
    await expect(page.getByText('tester@example.com')).toBeVisible();
  });

  test('A-05 rename updates name and renamed-pints count message', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await mockSignedIn(page);
    await skipAgeGate(page);

    await page.goto('/profile');
    const nameInput = page.locator('input[placeholder="Ant"]');
    await nameInput.fill('Anthony');
    await page.getByRole('button', { name: 'Save name' }).click();

    await expect(page.getByText(/Name updated/i)).toBeVisible();
  });

  test('A-07 sign out returns to sign-in screen', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await mockSignedIn(page);
    await skipAgeGate(page);

    await page.route('**/auth/v1/logout*', async (route) => {
      await route.fulfill({ status: 204, contentType: 'application/json', body: '' });
    });

    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Ant' })).toBeVisible();

    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible({ timeout: 10_000 });
  });

  test('L-02 legal privacy section loads', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/legal?section=privacy');

    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByText(/Data Protection Commission/i)).toBeVisible();
  });

  test('L-03 drink responsibly copy present on Legal and Add Pint', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/legal?section=responsible');
    await expect(page.getByRole('heading', { name: 'Drink responsibly' })).toBeVisible();

    await mockSupabaseEmpty(page);
    await page.goto('/add');
    await expect(page.getByText(/Drink responsibly/i)).toBeVisible();
  });
});
