export const PINT_TYPES = [
  'Guinness',
  'Beamish',
  'Murphy’s',
  'Other',
] as const;

export type PintType = (typeof PINT_TYPES)[number];

export type Pub = {
  id: string;
  name: string;
  location: string;
  country: string;
  distance: string;
};

export type Pint = {
  id: string;
  user: string;
  pintType: PintType;
  pubName: string;
  pubId: string;
  location: string;
  country: string;
  rating: number;
  photo: string;
  note: string;
  time: string;
};

type MockPubRecord = {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
};

type MockPintRecord = {
  id: string;
  photo_url: string;
  score: number;
  caption: string;
  pub_id: string | null;
  user: string;
  created_at: string;
  pint_type?: PintType;
};

const MOCK_PUBS: MockPubRecord[] = [
  {
    id: 'pub_1',
    name: 'The Long Hall',
    city: 'Dublin',
    latitude: 53.3414,
    longitude: -6.2655,
  },
  {
    id: 'pub_2',
    name: 'Mulligans',
    city: 'Dublin',
    latitude: 53.3458,
    longitude: -6.2555,
  },
];

let MOCK_PINTS: MockPintRecord[] = [
  {
    id: 'pint_1',
    photo_url:
      'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
    score: 4.9,
    caption: 'Creamy domed head. Perfect temperature.',
    pub_id: 'pub_1',
    user: 'TonyCooke',
    created_at: '2023-10-25T14:48:00.000Z',
    pint_type: 'Guinness',
  },
  {
    id: 'pint_2',
    photo_url:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    score: 4.4,
    caption: 'Solid pint, good atmosphere.',
    pub_id: 'pub_2',
    user: 'GuinnessFan99',
    created_at: '2023-10-26T18:30:00.000Z',
    pint_type: 'Guinness',
  },
  {
    id: 'pint_3',
    photo_url:
      'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?auto=format&fit=crop&w=800&q=80',
    score: 3.7,
    caption: 'A bit too cold, but poured well.',
    pub_id: 'pub_1',
    user: 'MysteryDrinker',
    created_at: '2023-10-24T20:15:00.000Z',
    pint_type: 'Guinness',
  },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

function mapPubRecordToPub(pub: MockPubRecord): Pub {
  return {
    id: pub.id,
    name: pub.name,
    location: pub.city,
    country: 'Ireland',
    distance: '',
  };
}

function mapPintRecordToPint(pint: MockPintRecord): Pint {
  const pub = MOCK_PUBS.find((p) => p.id === pint.pub_id);

  return {
    id: pint.id,
    user: pint.user,
    pintType: pint.pint_type ?? 'Guinness',
    pubName: pub?.name ?? 'Unknown Pub',
    pubId: pint.pub_id ?? '',
    location: pub?.city ?? 'Unknown Location',
    country: 'Ireland',
    rating: pint.score,
    photo: pint.photo_url,
    note: pint.caption,
    time: formatDate(pint.created_at),
  };
}

export async function fetchLivePubs(): Promise<Pub[]> {
  return MOCK_PUBS.map(mapPubRecordToPub);
}

export async function fetchLivePints(): Promise<Pint[]> {
  return [...MOCK_PINTS].reverse().map(mapPintRecordToPint);
}

export async function saveLivePint(input: {
  rating: number;
  pintType: PintType;
  comment: string;
  pubId: string | null;
}): Promise<void> {
  const newPint: MockPintRecord = {
    id: `pint_${Date.now()}`,
    photo_url:
      'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80',
    score: input.rating,
    caption: input.comment,
    pub_id: input.pubId,
    user: 'You',
    created_at: new Date().toISOString(),
    pint_type: input.pintType,
  };

  MOCK_PINTS = [...MOCK_PINTS, newPint];
}

export function getPintById(id: string): Pint | undefined {
  const pint = MOCK_PINTS.find((item) => item.id === id);
  return pint ? mapPintRecordToPint(pint) : undefined;
}

export function getPintsByPubId(pubId: string): Pint[] {
  return MOCK_PINTS
    .filter((pint) => pint.pub_id === pubId)
    .map(mapPintRecordToPint);
}

export function getPubRating(pubId: string): number {
  const pints = MOCK_PINTS.filter((pint) => pint.pub_id === pubId);

  if (pints.length === 0) {
    return 0;
  }

  const total = pints.reduce((sum, pint) => sum + pint.score, 0);
  return Number((total / pints.length).toFixed(1));
}

export const FEED_DATA: Pint[] = MOCK_PINTS.map(mapPintRecordToPint);