import { test, expect } from '@playwright/test';
import { mockSupabaseEmpty, mockSupabasePopulated, skipAgeGate } from './helpers';
import { MOCK_PINTS } from './fixtures';

test.describe('Find a Pint — QA-TEST-PLAN section 5', () => {
  test('D-01 screen title is "Find a Pint"', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await expect(page.getByRole('heading', { name: 'Find a Pint' })).toBeVisible();
  });

  test('D-02 default preset is Guinness 0.0 on Draught, last 30 days', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await expect(page.getByRole('button', { name: 'Guinness 0.0 on Draught' })).toHaveClass(/border-gold/);
    await expect(page.getByText('No matching pints yet')).not.toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('heading', { name: "Rosato's" })).toBeVisible();
    await expect(page.getByText("Keogh's")).not.toBeVisible();
  });

  test('D-03 other presets — Guinness, All pints', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await page.getByRole('button', { name: 'Guinness', exact: true }).click();
    await expect(page.getByText("Susie's")).toBeVisible();

    await page.getByRole('button', { name: 'All pints' }).click();
    await expect(page.getByText("Rosato's")).toBeVisible();
    await expect(page.getByText("Susie's")).toBeVisible();
  });

  test('D-04 search filters by pub name or town', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await page.getByRole('button', { name: 'All pints' }).click();
    await page.getByPlaceholder('Search pub or town').fill('Susie');

    await expect(page.getByText("Susie's")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("Rosato's")).not.toBeVisible();
  });

  test('D-05 recency filter — This week excludes older pints', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await page.getByRole('button', { name: 'All pints' }).click();
    await page.getByRole('button', { name: 'This week' }).click();

    await expect(page.getByText("Keogh's")).not.toBeVisible();
  });

  test('D-06 min score 8+ toggle filters low-rated pints', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await page.getByRole('button', { name: 'All pints' }).click();
    await expect(page.getByText("Susie's")).toBeVisible();

    await page.getByRole('button', { name: '8+' }).click();
    await expect(page.getByText("Susie's")).not.toBeVisible();
    await expect(page.getByText("Rosato's")).toBeVisible();
  });

  test('D-07 result cards show photo, pint label, avg score, pint count', async ({ page }) => {
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await expect(page.getByText('Guinness 0.0 · On draught')).toBeVisible();
    await expect(page.getByText('1 pint logged')).toBeVisible();
  });

  test('D-08 empty state shows helpful message and link to log a pint', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await expect(page.getByText('No pints found yet')).toBeVisible();
    await expect(page.getByText('Try another drink or widen your search.')).toBeVisible();
    const cta = page.getByRole('button', { name: /Log a pint/i });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/add$/);
  });

  test('D-09 location permission denied falls back to rating sort, no crash', async ({ page, context }) => {
    await context.grantPermissions([]);
    await mockSupabasePopulated(page);
    await skipAgeGate(page);
    await page.goto('/map');

    await expect(page.getByText('Sorted by rating')).toBeVisible({ timeout: 10_000 });
  });
});
