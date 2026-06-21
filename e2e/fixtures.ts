/**
 * Shared mock data for Playwright tests.
 * Shapes mirror the raw Supabase REST rows consumed by src/data/*.ts
 * (see PintRow in src/data/pintMapping.ts) — NOT the mapped `Pint` type.
 */

export type MockPubRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
};

export type MockProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string | null;
  country_of_origin: string | null;
  is_non_alcoholic: boolean;
  active: boolean;
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
  product_id: string | null;
  products: MockProductRow | null;
  pubs: MockPubRow;
};

const PHOTO = 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80';

export const MOCK_PRODUCTS: MockProductRow[] = [
  {
    id: 'prod-guinness',
    slug: 'guinness',
    name: 'Guinness',
    brand: 'Guinness',
    category: 'stout',
    country_of_origin: 'IE',
    is_non_alcoholic: false,
    active: true,
  },
  {
    id: 'prod-guinness-00',
    slug: 'guinness-00',
    name: 'Guinness 0.0',
    brand: 'Guinness',
    category: 'alcohol_free',
    country_of_origin: 'IE',
    is_non_alcoholic: true,
    active: true,
  },
  {
    id: 'prod-beamish',
    slug: 'beamish',
    name: 'Beamish',
    brand: 'Beamish',
    category: 'stout',
    country_of_origin: 'IE',
    is_non_alcoholic: false,
    active: true,
  },
  {
    id: 'prod-murphys',
    slug: 'murphys',
    name: "Murphy's",
    brand: "Murphy's",
    category: 'stout',
    country_of_origin: 'IE',
    is_non_alcoholic: false,
    active: true,
  },
  {
    id: 'prod-other',
    slug: 'other',
    name: 'Other',
    brand: null,
    category: 'other',
    country_of_origin: null,
    is_non_alcoholic: false,
    active: true,
  },
];

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
    product_id: 'prod-guinness-00',
    products: MOCK_PRODUCTS[1],
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
    product_id: 'prod-guinness',
    products: MOCK_PRODUCTS[0],
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
    product_id: 'prod-guinness-00',
    products: MOCK_PRODUCTS[1],
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
