import type { Page } from '@playwright/test';
import { MOCK_PINTS, MOCK_PUBS, MOCK_USER, mockSession, type MockPintRow } from './fixtures';

const AGE_GATE_KEY = 'nicepints_age_confirmed_v1';

/** Skip age gate for tests that don't cover L-01 */
export async function skipAgeGate(page: Page) {
  await page.addInitScript((key) => {
    localStorage.setItem(key, 'true');
  }, AGE_GATE_KEY);
}

function wantsSingleObject(headers: Record<string, string>): boolean {
  const accept = headers.accept ?? headers.Accept ?? '';
  return accept.includes('application/vnd.pgrst.object+json');
}

function authStorageKey(): string {
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? '';
  const projectRef = supabaseUrl.match(/^https?:\/\/([^.]+)\./)?.[1] ?? 'placeholder';
  return `sb-${projectRef}-auth-token`;
}

function parseEqValue(raw: string | undefined): string | null {
  if (!raw?.startsWith('eq.')) {
    return null;
  }

  let value = raw.slice(3).replace(/^"|"$/g, '');
  value = decodeURIComponent(value.replace(/\+/g, ' '));
  return value;
}

function filterPints(rows: MockPintRow[], url: string): MockPintRow[] {
  let filtered = rows;
  const params = new URL(url).searchParams;

  const pintId = parseEqValue(params.get('id') ?? undefined);
  if (pintId) {
    return filtered.filter((row) => row.id === pintId);
  }

  const pintType = parseEqValue(params.get('pint_type') ?? undefined);
  if (pintType) {
    filtered = filtered.filter((row) => row.pint_type === pintType);
  }

  const servingType = parseEqValue(params.get('serving_type') ?? undefined);
  if (servingType) {
    filtered = filtered.filter((row) => row.serving_type === servingType);
  }

  const userName = parseEqValue(params.get('user_name') ?? undefined);
  if (userName) {
    filtered = filtered.filter((row) => row.user_name === userName);
  }

  const scoreRaw = params.get('score');
  if (scoreRaw?.startsWith('gte.')) {
    const min = Number(scoreRaw.slice(4));
    filtered = filtered.filter((row) => row.score >= min);
  }

  const createdRaw = params.get('created_at');
  if (createdRaw?.startsWith('gte.')) {
    const since = createdRaw.slice(4).replace(/^"|"$/g, '');
    filtered = filtered.filter((row) => row.created_at >= since);
  }

  return filtered;
}

function parseIlikePattern(raw: string): string {
  const encoded = raw.slice(6);
  let decoded = encoded;
  try {
    decoded = decodeURIComponent(encoded);
  } catch {
    decoded = encoded;
  }
  return decoded.replace(/%/g, '').toLowerCase();
}

function filterPubs(rows: typeof MOCK_PUBS, url: string): typeof MOCK_PUBS {
  const params = new URL(url).searchParams;
  const pubId = parseEqValue(params.get('id') ?? undefined);
  if (pubId) {
    return rows.filter((row) => row.id === pubId);
  }

  const nameFilter = params.get('name');
  if (nameFilter?.startsWith('ilike.')) {
    const pattern = parseIlikePattern(nameFilter);
    return rows.filter((row) => row.name.toLowerCase().includes(pattern));
  }

  const cityFilter = params.get('city');
  if (cityFilter?.startsWith('ilike.')) {
    const pattern = parseIlikePattern(cityFilter);
    return rows.filter((row) => row.city.toLowerCase().includes(pattern));
  }

  return rows;
}

async function installRestHandler(
  page: Page,
  initialPints: MockPintRow[] | null,
  initialPubs: typeof MOCK_PUBS | null
) {
  const mutablePints = initialPints ? [...initialPints] : null;
  const mutablePubs = initialPubs ? [...initialPubs] : null;

  await page.route('**/rest/v1/**', async (route) => {
    const request = route.request();
    const url = request.url();
    const method = request.method();

    if (url.includes('/rest/v1/pint_reports') && method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: '[]',
      });
      return;
    }

    if (url.includes('/rest/v1/pub_requests') && method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: '[]',
      });
      return;
    }

    if (url.includes('/rest/v1/pint_reports') || url.includes('/rest/v1/pub_requests') || url.includes('/rest/v1/rpc/')) {
      await route.continue();
      return;
    }

    if (url.includes('/rest/v1/pints') && mutablePints !== null) {
      if (method === 'PATCH') {
        const fromName = parseEqValue(new URL(url).searchParams.get('user_name') ?? undefined);
        let updated: MockPintRow[] = [];

        if (fromName) {
          const body = request.postDataJSON() as { user_name?: string; user_id?: string } | null;
          updated = mutablePints
            .filter((row) => row.user_name === fromName)
            .map((row) => {
              const next = { ...row };
              if (body?.user_name) {
                next.user_name = body.user_name;
              }
              return next;
            });

          for (const row of updated) {
            const index = mutablePints.findIndex((p) => p.id === row.id);
            if (index >= 0) {
              mutablePints[index] = row;
            }
          }
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updated.map((row) => ({ id: row.id }))),
        });
        return;
      }

      if (method === 'POST') {
        const body = request.postDataJSON() as Partial<MockPintRow> | null;
        const created: MockPintRow = {
          id: 'pint-new',
          pub_id: body?.pub_id ?? 'pub-rosatos',
          user_name: body?.user_name ?? 'Ant',
          score: body?.score ?? 5,
          caption: body?.caption ?? null,
          photo_url: body?.photo_url ?? 'https://example.com/pint.jpg',
          created_at: new Date().toISOString(),
          pint_type: body?.pint_type ?? 'Guinness',
          serving_type: body?.serving_type ?? 'draught',
          pubs: mutablePubs?.[0] ?? MOCK_PUBS[0],
        };
        mutablePints.unshift(created);

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify([created]),
        });
        return;
      }

      if (method === 'DELETE') {
        const pintId = parseEqValue(new URL(url).searchParams.get('id') ?? undefined);
        const removed = pintId
          ? mutablePints.filter((row) => row.id === pintId).map((row) => ({ id: row.id }))
          : [];

        if (pintId) {
          const index = mutablePints.findIndex((row) => row.id === pintId);
          if (index >= 0) {
            mutablePints.splice(index, 1);
          }
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(removed),
        });
        return;
      }

      if (method === 'GET') {
        const filtered = filterPints(mutablePints, url);
        const pintId = parseEqValue(new URL(url).searchParams.get('id') ?? undefined);

        if (pintId && wantsSingleObject(request.headers())) {
          const pint = filtered.find((row) => row.id === pintId) ?? null;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(pint),
          });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(filtered),
        });
        return;
      }

      await route.continue();
      return;
    }

    if (url.includes('/rest/v1/pubs') && mutablePubs !== null) {
      if (method === 'POST' || method === 'PATCH') {
        await route.fulfill({
          status: method === 'POST' ? 201 : 200,
          contentType: 'application/json',
          body: JSON.stringify([mutablePubs[0]]),
        });
        return;
      }

      if (method === 'GET') {
        const filtered = filterPubs(mutablePubs, url);
        const pubId = parseEqValue(new URL(url).searchParams.get('id') ?? undefined);

        if (pubId && wantsSingleObject(request.headers())) {
          const pub = filtered.find((row) => row.id === pubId) ?? null;
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(pub),
          });
          return;
        }

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(filtered),
        });
        return;
      }

      await route.continue();
      return;
    }

    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: '[]',
      });
      return;
    }

    const body = wantsSingleObject(request.headers()) ? 'null' : '[]';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body,
    });
  });
}

async function installAuthGuestHandler(page: Page) {
  await page.route('**/auth/v1/**', async (route) => {
    const request = route.request();
    const url = request.url();
    const method = request.method();

    if (url.includes('/otp') && method === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }

    if (url.includes('token')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access_token: null, user: null }),
      });
      return;
    }

    await route.continue();
  });
}

/** Empty Supabase REST responses — lets UI render without real backend (CI-safe). */
export async function mockSupabaseEmpty(page: Page) {
  await installRestHandler(page, [], []);
  await installAuthGuestHandler(page);
}

/**
 * Populated Supabase REST responses — feed, map/discovery, and pub detail
 * all read from the same `pints` (joined `pubs`) shape.
 */
export async function mockSupabasePopulated(
  page: Page,
  pints: MockPintRow[] = MOCK_PINTS
) {
  await installRestHandler(page, pints, MOCK_PUBS);
  await installAuthGuestHandler(page);
}

/** Mock Supabase Storage uploads for pint photo tests. */
export async function mockStorageUpload(page: Page) {
  await page.route('**/storage/v1/object/**', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ Key: 'uploads/test-pint.jpg' }),
      });
      return;
    }
    await route.continue();
  });
}

/**
 * Seeds an authenticated Supabase session before the app boots.
 * Storage key matches supabase-js: sb-<project-ref>-auth-token
 */
export async function mockSignedIn(page: Page, user = MOCK_USER) {
  const storageKey = authStorageKey();
  const session = mockSession(user);

  await page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: storageKey, value: session }
  );

  await page.route('**/auth/v1/session*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ session, user }),
    });
  });

  await page.route('**/auth/v1/user', async (route) => {
    if (route.request().method() === 'PUT') {
      const body = route.request().postDataJSON() as { data?: { display_name?: string } };
      const updated = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          display_name: body?.data?.display_name ?? user.user_metadata.display_name,
        },
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(updated),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user),
    });
  });

  await page.route('**/auth/v1/token*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(session),
    });
  });

  await page.route('**/auth/v1/logout*', async (route) => {
    await route.fulfill({ status: 204, body: '' });
  });
}

/** Minimal 4:5 JPEG for file-picker tests (not the programmatic input.files shortcut). */
export async function createTestPhotoForUpload(
  page: Page
): Promise<{ name: string; mimeType: string; buffer: Buffer }> {
  const base64 = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create test photo');
    }
    context.fillStyle = '#c9a227';
    context.fillRect(0, 0, canvas.width, canvas.height);

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Could not create test photo'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          resolve(dataUrl.split(',')[1] ?? '');
        };
        reader.onerror = () => reject(new Error('Could not create test photo'));
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.92);
    });
  });

  return {
    name: 'pint-test.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from(base64, 'base64'),
  };
}

/** Mock Places autocomplete + details (production uses Netlify functions). */
export async function mockGooglePlaces(page: Page) {
  await page.route('**/.netlify/functions/places-autocomplete', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        suggestions: [
          {
            placePrediction: {
              placeId: 'ChIJmockMurphys',
              structuredFormat: {
                mainText: { text: "Murphy's Bar" },
                secondaryText: { text: 'Dublin, Ireland' },
              },
              text: { text: "Murphy's Bar, Dublin, Ireland" },
            },
          },
        ],
      }),
    });
  });

  await page.route('**/.netlify/functions/places-details*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'ChIJmockMurphys',
        displayName: { text: "Murphy's Bar" },
        formattedAddress: "Murphy's Bar, Dublin, Ireland",
        location: { latitude: 53.3498, longitude: -6.2603 },
        addressComponents: [
          { longText: 'Dublin', types: ['locality'] },
          { longText: 'Ireland', types: ['country'] },
        ],
      }),
    });
  });

  await page.route('https://places.googleapis.com/v1/places:autocomplete', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        suggestions: [
          {
            placePrediction: {
              placeId: 'ChIJmockMurphys',
              structuredFormat: {
                mainText: { text: "Murphy's Bar" },
                secondaryText: { text: 'Dublin, Ireland' },
              },
            },
          },
        ],
      }),
    });
  });
}
