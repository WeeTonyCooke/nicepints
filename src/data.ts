import { supabase } from './supabaseClient';
import { getDisplayName } from './utils/user';
import {
  FALLBACK_PHOTO_URL,
  PINT_TYPES,
  type Pint,
  type PintType,
  type Pub,
  type ServingType,
} from './data/types';

export { findPours, formatPourLabel, formatServingLabel, resolvePourFilter, describePourPreset, formatPourResultScore, RECENCY_OPTIONS } from './data/discovery';
export type { PourFilter, PourPresetId, PourResult, RecencyDays } from './data/discovery';
export { PINT_TYPES, SERVING_TYPES, FALLBACK_PHOTO_URL } from './data/types';
export type { Pint, PintType, Pub, ServingType } from './data/types';

export const MAX_PINT_SCORE = 10;

export function formatPintScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

type PubRow = {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type PubRelation = {
  name: string | null;
  city: string | null;
  country: string | null;
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
  serving_type?: string | null;
  pubs?: PubRelation | PubRelation[] | null;
};

function normalizePubRelation(
  pubs: PubRelation | PubRelation[] | null | undefined
): PubRelation | null {
  if (!pubs) {
    return null;
  }

  if (Array.isArray(pubs)) {
    return pubs[0] ?? null;
  }

  return pubs;
}

type SaveLivePintInput = {
  rating: number;
  pintType: PintType;
  servingType: ServingType;
  comment: string;
  pubId: string | null;
  photoFile: File;
};

const PINT_PHOTO_BUCKET = 'pint-photos';

export function isStockPhotoUrl(url: string): boolean {
  return url === FALLBACK_PHOTO_URL || url.includes('images.unsplash.com');
}

function formatDate(value: string | null): string {
  if (!value) return 'Recently';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString();
}

function coerceServingType(value: string | null | undefined): ServingType {
  if (value === 'draught' || value === 'can' || value === 'bottle') {
    return value;
  }
  return 'unknown';
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
    country: pub.country ?? 'Ireland',
    distance: '',
    latitude: pub.latitude ?? null,
    longitude: pub.longitude ?? null,
  };
}

function mapPintRowToPint(pint: PintRow): Pint {
  const pub = normalizePubRelation(pint.pubs);

  return {
    id: pint.id,
    user: pint.user_name ?? 'Anonymous',
    pintType: coercePintType(pint.pint_type),
    servingType: coerceServingType(pint.serving_type),
    pubName: pub?.name ?? 'Unknown Pub',
    pubId: pint.pub_id ?? '',
    location: pub?.city ?? 'Unknown Location',
    country: pub?.country ?? 'Ireland',
    rating: Number(pint.score ?? 0),
    photo: pint.photo_url ?? FALLBACK_PHOTO_URL,
    note: pint.caption ?? '',
    time: formatDate(pint.created_at),
    createdAt: pint.created_at,
  };
}

function getFileExtension(file: File): string {
  const fileNameParts = file.name.split('.');
  const extension = fileNameParts[fileNameParts.length - 1];

  if (!extension || extension === file.name) {
    return 'jpg';
  }

  return extension.toLowerCase();
}

async function uploadPintPhoto(file: File): Promise<string> {
  const fileExt = getFileExtension(file);
  const filePath = `uploads/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(PINT_PHOTO_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(`Photo upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(PINT_PHOTO_BUCKET).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error('Photo uploaded, but public URL could not be created.');
  }

  return data.publicUrl;
}

export async function fetchLivePubs(): Promise<Pub[]> {
  const { data, error } = await supabase
    .from('pubs')
    .select('id, name, city, country, latitude, longitude')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load pubs: ${error.message}`);
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
      serving_type,
      pubs (
        name,
        city,
        country
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load pints: ${error.message}`);
  }

  return ((data ?? []) as PintRow[]).map(mapPintRowToPint);
}

export async function saveLivePint(input: SaveLivePintInput): Promise<void> {
  if (!input.pubId) {
    throw new Error('A pub must be selected before saving.');
  }

  if (!input.photoFile) {
    throw new Error('Add a photo of your pint before posting.');
  }

  const photoUrl = await uploadPintPhoto(input.photoFile);

  const { data: { session } } = await supabase.auth.getSession();
  const userName = getDisplayName(session?.user ?? null);

  if (!session?.user || !userName) {
    throw new Error('Sign in from your profile before posting a pint.');
  }

  const { error } = await supabase.from('pints').insert({
    pub_id: input.pubId,
    user_id: session.user.id,
    user_name: userName,
    score: input.rating,
    caption: input.comment,
    pint_type: input.pintType,
    serving_type: input.servingType,
    photo_url: photoUrl,
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
      serving_type,
      pubs (
        name,
        city,
        country
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load pint: ${error.message}`);
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
      serving_type,
      pubs (
        name,
        city,
        country
      )
    `)
    .eq('pub_id', pubId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load pub pints: ${error.message}`);
  }

  return ((data ?? []) as PintRow[]).map(mapPintRowToPint);
}

export async function getPubRating(pubId: string): Promise<number> {
  const { data, error } = await supabase
    .from('pints')
    .select('score')
    .eq('pub_id', pubId);

  if (error) {
    throw new Error(`Failed to load pub rating: ${error.message}`);
  }

  const rows = (data ?? []) as Array<{ score: number | string | null }>;
  if (rows.length === 0) return 0;

  const total = rows.reduce((sum, row) => sum + Number(row.score ?? 0), 0);
  return Number((total / rows.length).toFixed(1));
}

export async function fetchPintsByUser(userName: string): Promise<Pint[]> {
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
      serving_type,
      pubs (
        name,
        city,
        country
      )
    `)
    .eq('user_name', userName)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load user pints: ${error.message}`);
  }

  return ((data ?? []) as PintRow[]).map(mapPintRowToPint);
}

export async function renamePintsByUserName(
  oldName: string,
  newName: string
): Promise<number> {
  const from = oldName.trim();
  const to = newName.trim();

  if (!from || !to || from === to) {
    return 0;
  }

  const { data, error } = await supabase
    .from('pints')
    .update({ user_name: to })
    .eq('user_name', from)
    .select('id');

  if (error) {
    throw new Error(`Could not rename pints: ${error.message}`);
  }

  return data?.length ?? 0;
}

export async function claimMyPints(): Promise<number> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userName = getDisplayName(session?.user ?? null);

  if (!session?.user || !userName) {
    return 0;
  }

  const { data, error } = await supabase
    .from('pints')
    .update({ user_id: session.user.id })
    .eq('user_name', userName)
    .is('user_id', null)
    .select('id');

  if (error) {
    if (error.code === '42703' || error.message.includes('user_id')) {
      return 0;
    }
    throw new Error(`Could not link pints to your account: ${error.message}`);
  }

  return data?.length ?? 0;
}

export async function deleteMyPint(pintId: string): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Sign in to delete a pint.');
  }

  await claimMyPints();

  const { data, error } = await supabase.from('pints').delete().eq('id', pintId).select('id');

  if (error) {
    if (error.code === '42501') {
      throw new Error(
        'Delete not allowed. Run supabase/migrations/20250621000000_pint_user_id_ownership.sql in Supabase.'
      );
    }
    throw new Error(`Could not delete pint: ${error.message}`);
  }

  if (!data?.length) {
    throw new Error('Could not delete this pint. Try again or sign out and back in.');
  }
}