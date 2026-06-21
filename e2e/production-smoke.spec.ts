import { test, expect } from '@playwright/test';
import { skipAgeGate } from './helpers';

/**
 * Read-only smoke checks against the live site (no Supabase mocks).
 * Auth, post, and delete steps remain manual — see docs/QA-TEST-PLAN.md.
 */
test.describe('Production smoke — nicepints.com', () => {
  test('L-01 age gate on first visit', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'I meet the legal age' })).toBeVisible();
  });

  test('Feed loads after age gate', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/');
    await expect(
      page.getByText('Find a great pint near you.').or(page.getByText('Top pint'))
    ).toBeVisible({ timeout: 15_000 });
  });

  test('Find a Pint — title and 0.0 on Draught preset', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/map');
    await expect(page.getByRole('heading', { name: 'Find a Pint' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole('button', { name: 'Guinness 0.0 on Draught' })).toBeVisible();
  });

  test('Add Pint — pub search and post-time auth copy', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/add');
    await expect(page.getByRole('heading', { name: 'Log a Pint' })).toBeVisible();
    await expect(page.getByPlaceholder('Search pub or bar')).toBeVisible();
    await expect(page.getByText(/click to choose|drop a photo/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Add a photo to post|Sign in to post/i })
    ).toBeVisible();
  });

  test('Legal — GDPR privacy policy', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/legal?section=privacy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByText(/Data Protection Commission/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'hello@nicepints.com' })).toBeVisible();
  });

  test('Profile — sign-in screen', async ({ page }) => {
    await skipAgeGate(page);
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send sign-in email' })).toBeVisible();
  });
});
