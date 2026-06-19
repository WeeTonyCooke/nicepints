import { test, expect } from '@playwright/test';
import { mockSupabaseEmpty, skipAgeGate } from './helpers';

test.describe('Smoke — QA-TEST-PLAN', () => {
  test('L-01 age gate shows on first launch', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await page.getByRole('button', { name: 'I meet the legal age' }).click();

    await expect(page.getByRole('heading', { name: 'Welcome' })).not.toBeVisible();
    await expect(
      page.getByText('No pints have been poured yet').or(page.getByText('Top Pour'))
    ).toBeVisible({ timeout: 10_000 });
  });

  test('F-01 feed route loads', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Feed' })).toBeVisible();
  });

  test('D-01 Find a Pour screen loads', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await expect(page.getByRole('heading', { name: 'Find a Pour' })).toBeVisible();
    await expect(page.getByRole('button', { name: '0.0 on Draught' })).toBeVisible();
    await expect(page.getByPlaceholder('Search pub or town')).toBeVisible();
    await expect(page.getByText('Nothing poured here yet')).toBeVisible({ timeout: 10_000 });
  });

  test('A-01 profile sign-in form loads', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/profile');

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Name on pints')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send sign-in email' })).toBeVisible();
  });

  test('L-02 legal privacy section loads', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/legal?section=privacy');

    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });

  test('P-01 add pint requires sign-in prompt', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    await expect(page.getByRole('heading', { name: 'Log a Pint' })).toBeVisible();
    await expect(page.getByText(/Sign in from your profile/i)).toBeVisible();
  });
});
