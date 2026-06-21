import { test, expect } from '@playwright/test';
import {
  createTestPhotoForUpload,
  mockGooglePlaces,
  mockStorageUpload,
  mockSupabaseEmpty,
  mockSupabasePopulated,
  mockSignedIn,
  skipAgeGate,
} from './helpers';

async function uploadPintPhoto(page: import('@playwright/test').Page) {
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

    await expect(page.getByRole('button', { name: 'Guinness 0.0', exact: true })).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole('button', { name: 'Guinness 0.0', exact: true }).click();

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

  test('P-08 desktop click opens file picker (not only drag-and-drop)', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    const photoInput = page.locator('#pint-photo-input');
    await expect(photoInput).toHaveCount(1);

    const photoZone = page.locator('label[for="pint-photo-input"]');
    await expect(photoZone).toBeVisible();
    await expect(photoZone).toContainText(/click to choose/i);

    const testPhoto = await createTestPhotoForUpload(page);
    const fileChooserPromise = page.waitForEvent('filechooser');
    await photoZone.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testPhoto);

    await expect(page.getByRole('heading', { name: 'Crop your photo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Use photo' })).toBeEnabled({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Use photo' }).click();
    await expect(page.getByRole('heading', { name: 'Crop your photo' })).not.toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('img', { name: 'pint-test.jpg' })).toBeVisible({ timeout: 10_000 });
  });

  test('P-09 cropped photo keeps 4:5 aspect ratio', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    const testPhoto = await createTestPhotoForUpload(page);
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('label[for="pint-photo-input"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testPhoto);

    await expect(page.getByRole('heading', { name: 'Crop your photo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Use photo' })).toBeEnabled({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Use photo' }).click();
    await expect(page.getByRole('heading', { name: 'Crop your photo' })).not.toBeVisible({ timeout: 10_000 });

    const preview = page.getByRole('img', { name: 'pint-test.jpg' });
    await expect(preview).toBeVisible({ timeout: 10_000 });
    await expect(preview).toHaveJSProperty('complete', true, { timeout: 10_000 });

    const aspectRatio = await preview.evaluate((img) => {
        const el = img as HTMLImageElement;
        return el.naturalWidth / el.naturalHeight;
      });

    expect(aspectRatio).toBeCloseTo(0.8, 2);
    await expect(preview).toHaveJSProperty('naturalWidth', 1080);
    await expect(preview).toHaveJSProperty('naturalHeight', 1350);
  });

  test('P-09b portrait source photo keeps 4:5 aspect ratio after crop', async ({ page }) => {
    await mockSupabaseEmpty(page);
    await skipAgeGate(page);
    await page.goto('/add');

    const portraitPhoto = await page.evaluate(async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1600;
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not create test photo');
      }
      context.fillStyle = '#13110F';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#C9A227';
      context.fillRect(120, 420, 660, 760);

      return new Promise<{ name: string; mimeType: string; buffer: string }>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Could not create test photo'));
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            resolve({
              name: 'portrait-pint.jpg',
              mimeType: 'image/jpeg',
              buffer: dataUrl.split(',')[1] ?? '',
            });
          };
          reader.onerror = () => reject(new Error('Could not create test photo'));
          reader.readAsDataURL(blob);
        }, 'image/jpeg', 0.92);
      });
    });

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('label[for="pint-photo-input"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: portraitPhoto.name,
      mimeType: portraitPhoto.mimeType,
      buffer: Buffer.from(portraitPhoto.buffer, 'base64'),
    });

    await expect(page.getByRole('heading', { name: 'Crop your photo' })).toBeVisible();
    await page.getByRole('button', { name: 'Use photo' }).click();

    const preview = page.getByRole('img', { name: 'portrait-pint.jpg' });
    await expect(preview).toBeVisible({ timeout: 10_000 });
    await expect(preview).toHaveJSProperty('complete', true, { timeout: 10_000 });

    const aspectRatio = await preview.evaluate((img) => {
      const el = img as HTMLImageElement;
      return el.naturalWidth / el.naturalHeight;
    });

    expect(aspectRatio).toBeCloseTo(0.8, 2);
    await expect(preview).toHaveJSProperty('naturalWidth', 1080);
    await expect(preview).toHaveJSProperty('naturalHeight', 1350);
  });

  test('P-10 Google Places results appear alongside local pubs', async ({ page }) => {
    await mockSupabasePopulated(page);
    await mockGooglePlaces(page);
    await skipAgeGate(page);
    await page.goto('/add');

    await page.getByPlaceholder('Search pub or bar').fill('Murphy');
    await expect(page.getByRole('button', { name: /Murphy's Bar/i })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Place data from Google')).toBeVisible();
  });

  test('P-01/P-07 signed-in post with photo redirects to feed', async ({ page }) => {
    await mockSupabasePopulated(page);
    await mockSignedIn(page);
    await mockStorageUpload(page);
    await skipAgeGate(page);

    await page.goto('/add');
    await selectPubFromSearch(page, 'Rosato');

    await page.getByRole('button', { name: 'Serious' }).click();
    await uploadPintPhoto(page);

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
    await uploadPintPhoto(page);

    await expect(page.getByRole('button', { name: 'Sign in to post' })).toBeEnabled({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Sign in to post' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in to post' })).toBeVisible();
  });
});
