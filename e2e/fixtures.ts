/**
 * Shared mock data for Playwright tests.
 * Shapes mirror the raw Supabase REST rows consumed by src/data/*.ts
 * (see PintRow in src/data/discovery.ts) — NOT the mapped `Pint` type.
 */

export type MockPubRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type MockPintRow = {
  id: string;
  pub_id: string;
  user_name: string;
  score: number;
  caption: string | null;
  photo_url: string;
  created_at: string;
  pint_type: string;
  serving_type: string;
  pubs: MockPubRow;
};

const PHOTO = 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80';

export const MOCK_PUBS: MockPubRow[] = [
  {
    id: 'pub-rosatos',
    name: "Rosato's",
    city: 'Moville',
    country: 'Ireland',
    latitude: 55.1804,
    longitude: -7.0512,
  },
  {
    id: 'pub-susies',
    name: "Susie's",
    city: 'Moville',
    country: 'Ireland',
    latitude: 55.1812,
    longitude: -7.0498,
  },
  {
    id: 'pub-keoghs',
    name: "Keogh's",
    city: 'Dublin',
    country: 'Ireland',
    latitude: 53.3498,
    longitude: -6.2603,
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_PINTS: MockPintRow[] = [
  {
    id: 'pint-1',
    pub_id: 'pub-rosatos',
    user_name: 'Ant',
    score: 9,
    caption: 'Perfect settle, no rush.',
    photo_url: PHOTO,
    created_at: daysAgo(1),
    pint_type: 'Guinness 0.0',
    serving_type: 'draught',
    pubs: MOCK_PUBS[0],
  },
  {
    id: 'pint-2',
    pub_id: 'pub-susies',
    user_name: 'Katrina',
    score: 7,
    caption: 'Decent pour, bit warm.',
    photo_url: PHOTO,
    created_at: daysAgo(3),
    pint_type: 'Guinness',
    serving_type: 'draught',
    pubs: MOCK_PUBS[1],
  },
  {
    id: 'pint-3',
    pub_id: 'pub-keoghs',
    user_name: 'Rona',
    score: 8,
    caption: null,
    photo_url: PHOTO,
    created_at: daysAgo(45),
    pint_type: 'Guinness 0.0',
    serving_type: 'can',
    pubs: MOCK_PUBS[2],
  },
];

export const MOCK_USER = {
  id: 'user-test-1',
  email: 'tester@example.com',
  user_metadata: { display_name: 'Ant' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

/** Minimal Supabase session payload shape used by supabase-js v2 GoTrue client. */
export function mockSession(user = MOCK_USER) {
  return {
    access_token: 'mock-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'mock-refresh-token',
    user,
  };
}
