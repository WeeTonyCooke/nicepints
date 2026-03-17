import { supabase } from './supabaseClient';

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

type PubRow = {
  id: string;
  name: string;
  city: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type PintRow = {
  id: string;
  pub_id: string | null;
  user_name: string | null;
  score: number | string | null;
  caption: string | null;
  photo_url: string | null;
  created_at: string | null;
  pint_type: string | null;
  pubs?: {
    name: string | null;
    city: string | null;
  } | null;
};

function formatDate(value: string | null): string {
  if (!value) return 'Recently';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString();
}

function coercePintType(value: string | null): PintType {
  if (value && PINT_TYPES.includes(value as PintType)) {
    return value as PintType;
  }
  return 'Guinness';
}

function mapPubRowToPub(pub: PubRow): Pub {
  return {
    id: pub.id,
    name: pub.name,
    location: pub.city ?? 'Unknown Location',
    country: 'Ireland',
    distance: '',
  };
}

function mapPintRowToPint(pint: PintRow): Pint {
  return {
    id: pint.id,
    user: pint.user_name ?? 'Anonymous',
    pintType: coercePintType(pint.pint_type),
    pubName: pint.pubs?.name ?? 'Unknown Pub',
    pubId: pint.pub_id ?? '',
    location: pint.pubs?.city ?? 'Unknown Location',
    country: 'Ireland',
    rating: Number(pint.score ?? 0),
    photo:
      pint.photo_url ??
      'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80',
    note: pint.caption ?? '',
    time: formatDate(pint.created_at),
  };
}

export async function fetchLivePubs(): Promise<Pub[]> {
  const { data, error } = await supabase
    .from('pubs')
    .select('id, name, city, latitude, longitude')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching pubs:', error.message);
    return [];
  }

  return (data as PubRow[]).map(mapPubRowToPub);
}

export async function fetchLivePints(): Promise<Pint[]> {
  const { data, error } = await supabase
    .from('pints')
    .select(`
      id,
      pub_id,
      user_name,
      score,
      caption,
      photo_url,
      created_at,
      pint_type,
      pubs (
        name,
        city
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pints:', error.message);
    return [];
  }

  return (data as PintRow[]).map(mapPintRowToPint);
}

export async function saveLivePint(input: {
  rating: number;
  pintType: PintType;
  comment: string;
  pubId: string | null;
}): Promise<void> {
  if (!input.pubId) {
    throw new Error('A pub must be selected before saving.');
  }

  const { error } = await supabase.from('pints').insert({
    pub_id: input.pubId,
    user_name: 'TonyCooke',
    score: input.rating,
    caption: input.comment,
    pint_type: input.pintType,
    photo_url:
      'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80',
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getPintById(id: string): Promise<Pint | undefined> {
  const { data, error } = await supabase
    .from('pints')
    .select(`
      id,
      pub_id,
      user_name,
      score,
      caption,
      photo_url,
      created_at,
      pint_type,
      pubs (
        name,
        city
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching pint by id:', error.message);
    return undefined;
  }

  return data ? mapPintRowToPint(data as PintRow) : undefined;
}

export async function getPintsByPubId(pubId: string): Promise<Pint[]> {
  const { data, error } = await supabase
    .from('pints')
    .select(`
      id,
      pub_id,
      user_name,
      score,
      caption,
      photo_url,
      created_at,
      pint_type,
      pubs (
        name,
        city
      )
    `)
    .eq('pub_id', pubId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pints for pub:', error.message);
    return [];
  }

  return (data as PintRow[]).map(mapPintRowToPint);
}

export async function getPubRating(pubId: string): Promise<number> {
  const { data, error } = await supabase
    .from('pints')
    .select('score')
    .eq('pub_id', pubId);

  if (error) {
    console.error('Error fetching pub rating:', error.message);
    return 0;
  }

  const rows = (data ?? []) as Array<{ score: number | string | null }>;
  if (rows.length === 0) return 0;

  const total = rows.reduce((sum, row) => sum + Number(row.score ?? 0), 0);
  return Number((total / rows.length).toFixed(1));
}

export const FEED_DATA: Pint[] = [];