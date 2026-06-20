import { supabase } from '../supabaseClient';
import {
  FALLBACK_PHOTO_URL,
  SERVING_TYPES,
  type Pint,
  type Pub,
  type ServingType,
} from './types';
import {
  formatDistance,
  haversineDistanceKm,
  type Coordinates,
} from '../utils/geolocation';

export { SERVING_TYPES };
export type { ServingType };

export const RECENCY_OPTIONS = [
  { label: 'This week', days: 7 },
  { label: 'This month', days: 30 },
  { label: 'All time', days: null },
] as const;

export type RecencyDays = (typeof RECENCY_OPTIONS)[number]['days'];

export type PourPresetId = 'guinness-00-draught' | 'guinness' | 'all';

export type PourFilter = {
  preset?: PourPresetId;
  pintType?: string | null;
  servingType?: ServingType | null;
  minScore?: number;
  recencyDays?: RecencyDays;
  maxDistanceKm?: number | null;
  searchQuery?: string;
  userCoords?: Coordinates | null;
};

export type PourResult = {
  pub: Pub;
  bestPint: Pint;
  matchingCount: number;
  avgScore: number;
  distanceKm: number | null;
  distance: string;
};

type PubRelation = {
  name: string | null;
  city: string | null;
  country: string | null;
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
  serving_type: string | null;
  pubs?: PubRelation | PubRelation[] | null;
};

function normalizePubRelation(
  pubs: PubRelation | PubRelation[] | null | undefined
): PubRelation | null {
  if (!pubs) return null;
  return Array.isArray(pubs) ? (pubs[0] ?? null) : pubs;
}

function coerceServingType(value: string | null): ServingType {
  if (value && SERVING_TYPES.includes(value as ServingType)) {
    return value as ServingType;
  }
  return 'unknown';
}

function mapPintRow(pint: PintRow): Pint {
  const pub = normalizePubRelation(pint.pubs);

  return {
    id: pint.id,
    user: pint.user_name ?? 'Anonymous',
    pintType: (pint.pint_type ?? 'Guinness') as Pint['pintType'],
    servingType: coerceServingType(pint.serving_type),
    pubName: pub?.name ?? 'Unknown Pub',
    pubId: pint.pub_id ?? '',
    location: pub?.city ?? 'Unknown Location',
    country: pub?.country ?? 'Ireland',
    rating: Number(pint.score ?? 0),
    photo: pint.photo_url ?? FALLBACK_PHOTO_URL,
    note: pint.caption ?? '',
    time: pint.created_at
      ? new Date(pint.created_at).toLocaleDateString()
      : 'Recently',
    createdAt: pint.created_at,
  };
}

export function formatServingLabel(servingType: ServingType): string {
  switch (servingType) {
    case 'draught':
      return 'On draught';
    case 'can':
      return 'Can';
    case 'bottle':
      return 'Bottle';
    default:
      return '';
  }
}

export function formatPourLabel(pint: Pick<Pint, 'pintType' | 'servingType'>): string {
  const serve = formatServingLabel(pint.servingType);
  return serve ? `${pint.pintType} · ${serve}` : pint.pintType;
}

export function resolvePourFilter(preset: PourPresetId): PourFilter {
  switch (preset) {
    case 'guinness-00-draught':
      return {
        preset,
        pintType: 'Guinness 0.0',
        servingType: 'draught',
        minScore: 8,
        recencyDays: 30,
        maxDistanceKm: 5,
      };
    case 'guinness':
      return {
        preset,
        pintType: 'Guinness',
        servingType: null,
        minScore: 0,
        recencyDays: 30,
        maxDistanceKm: null,
      };
    default:
      return {
        preset: 'all',
        pintType: null,
        servingType: null,
        minScore: 0,
        recencyDays: null,
        maxDistanceKm: null,
      };
  }
}

export async function findPours(filter: PourFilter): Promise<PourResult[]> {
  let query = supabase
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
        id,
        name,
        city,
        country,
        latitude,
        longitude
      )
    `)
    .order('created_at', { ascending: false });

  if (filter.pintType) {
    query = query.eq('pint_type', filter.pintType);
  }

  if (filter.servingType) {
    query = query.eq('serving_type', filter.servingType);
  }

  if (filter.minScore && filter.minScore > 0) {
    query = query.gte('score', filter.minScore);
  }

  if (filter.recencyDays) {
    const since = new Date();
    since.setDate(since.getDate() - filter.recencyDays);
    query = query.gte('created_at', since.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    if (error.message.includes('serving_type') || error.code === '42703') {
      throw new Error(
        'Discovery filters need the Phase 2 migration. Run supabase/migrations/20250622000000_phase2_discovery.sql in Supabase.'
      );
    }
    throw new Error(`Failed to find pours: ${error.message}`);
  }

  const pints = ((data ?? []) as PintRow[]).map(mapPintRow);
  const byPub = new Map<string, Pint[]>();

  for (const pint of pints) {
    if (!pint.pubId) continue;
    const existing = byPub.get(pint.pubId) ?? [];
    existing.push(pint);
    byPub.set(pint.pubId, existing);
  }

  const results: PourResult[] = [];

  for (const [pubId, pubPints] of byPub) {
    const sample = pubPints[0];
    const pubRow = (data as PintRow[]).find((row) => row.pub_id === pubId);
    const pubRel = normalizePubRelation(pubRow?.pubs);

    const pub: Pub = {
      id: pubId,
      name: pubRel?.name ?? sample.pubName,
      location: pubRel?.city ?? sample.location,
      country: pubRel?.country ?? sample.country,
      distance: '',
      latitude: pubRel?.latitude ?? null,
      longitude: pubRel?.longitude ?? null,
    };

    const sorted = [...pubPints].sort((a, b) => b.rating - a.rating);
    const avgScore =
      pubPints.reduce((sum, pint) => sum + pint.rating, 0) / pubPints.length;

    let distanceKm: number | null = null;
    let distance = '';

    if (
      filter.userCoords &&
      pub.latitude !== null &&
      pub.longitude !== null
    ) {
      distanceKm = haversineDistanceKm(filter.userCoords, {
        latitude: pub.latitude,
        longitude: pub.longitude,
      });
      distance = formatDistance(distanceKm);

      if (filter.maxDistanceKm && distanceKm > filter.maxDistanceKm) {
        continue;
      }
    }

    results.push({
      pub,
      bestPint: sorted[0],
      matchingCount: pubPints.length,
      avgScore: Number(avgScore.toFixed(1)),
      distanceKm,
      distance,
    });
  }

  const search = filter.searchQuery?.trim().toLowerCase();
  const filtered = search
    ? results.filter(
        (result) =>
          result.pub.name.toLowerCase().includes(search) ||
          result.pub.location.toLowerCase().includes(search)
      )
    : results;

  return filtered.sort((a, b) => {
    if (a.distanceKm !== null && b.distanceKm !== null) {
      return a.distanceKm - b.distanceKm;
    }
    if (a.distanceKm !== null) return -1;
    if (b.distanceKm !== null) return 1;
    return b.avgScore - a.avgScore;
  });
}

export function describePourPreset(preset: PourPresetId): string {
  switch (preset) {
    case 'guinness-00-draught':
      return 'Guinness 0.0 on draught, rated 8+, within 5 km when location is on.';
    case 'guinness':
      return 'Regular Guinness draught and pours near you.';
    default:
      return 'All rated pours, any product.';
  }
}

export function formatPourResultScore(result: PourResult): string {
  return Number.isInteger(result.avgScore)
    ? String(result.avgScore)
    : result.avgScore.toFixed(1);
}
