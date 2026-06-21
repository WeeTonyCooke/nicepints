import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function uploadPintPhoto(page: Page) {
  await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 100;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create test photo');
    }
    context.fillStyle = '#c9a227';
    context.fillRect(0, 0, canvas.width, canvas.height);

    return new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not create test photo'));
          return;
        }

        const file = new File([blob], 'pint-test.jpg', { type: 'image/jpeg' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement | null;
        if (!input) {
          reject(new Error('Photo input not found'));
          return;
        }

        const transfer = new DataTransfer();
        transfer.items.add(file);
        input.files = transfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        resolve();
      }, 'image/jpeg', 0.92);
    });
  });

  await expect(page.getByRole('heading', { name: 'Crop your photo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Use photo' })).toBeEnabled({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Use photo' }).click();
}

export async function selectDrink(page: Page, name = 'Guinness') {
  await expect(page.getByText('Loading drinks...')).not.toBeVisible({ timeout: 20_000 });
  const drinkButton = page.getByRole('button', { name, exact: true }).first();
  await expect(drinkButton).toBeVisible({ timeout: 10_000 });
  await drinkButton.click();
}

export async function selectPubFromSearch(page: Page, query: string) {
  await page.getByPlaceholder('Search pub or bar').fill(query);
  await expect(page.getByRole('button', { name: new RegExp(query, 'i') })).toBeVisible({
    timeout: 10_000,
  });
  await page.getByText("Rosato's", { exact: true }).click();
  await expect(page.getByText(/Selected: Rosato/i)).toBeVisible({ timeout: 10_000 });
}

export async function postSignedInPint(page: Page, options?: { ratingLabel?: string }) {
  await page.goto('/add');
  await uploadPintPhoto(page);
  await selectDrink(page);
  await selectPubFromSearch(page, 'Rosato');
  await page.getByRole('button', { name: options?.ratingLabel ?? 'Serious' }).click();

  await expect(page.getByRole('button', { name: 'Post Pint' })).toBeEnabled({ timeout: 10_000 });
  await page.getByRole('button', { name: 'Post Pint' }).click();
  await expect(page).toHaveURL('/', { timeout: 20_000 });
  await expect(page.getByText('Pint logged')).toBeVisible({ timeout: 10_000 });
}
