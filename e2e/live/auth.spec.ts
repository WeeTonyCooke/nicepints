import { test, expect } from '@playwright/test';
import { skipAgeGate } from '../helpers';
import {
  createConfirmedTestUser,
  fetchLatestOtpFromInbucket,
  signInViaMagicLink,
} from '../helpers/live-auth';

test.describe('Live Supabase — authentication', () => {
  test.beforeEach(async ({ page }) => {
    await skipAgeGate(page);
  });

  test('L-A02 magic link signs in against real Supabase auth', async ({ page }) => {
    const { displayName } = await signInViaMagicLink(page, { displayName: 'QA Bot' });

    await expect(page.getByRole('heading', { name: displayName })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  });

  test('L-A03 email OTP verifies against real Supabase auth', async ({ page }) => {
    test.setTimeout(120_000);

    const { email, displayName } = await createConfirmedTestUser({ displayName: 'OTP Bot' });

    await page.goto('/profile');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Name on pints').fill(displayName);
    const sentAt = Date.now();
    await page.getByRole('button', { name: 'Send sign-in email' }).click();

    await expect(page.getByText('Check your email.', { exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('#sign-in-code')).toBeVisible();

    const otp = await fetchLatestOtpFromInbucket(email, 60_000, sentAt);
    await page.locator('#sign-in-code').fill(otp);
    await page.getByRole('button', { name: 'Verify with code' }).click();

    await expect(page.getByText('Signed in successfully.')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('heading', { name: displayName })).toBeVisible();
  });
});
