import { supabase } from '../supabaseClient';
import {
  mapPintRowToPint,
  normalizeRelation,
  PINT_SELECT_WITH_PUB_GEO,
  pintMatchesProductSlug,
  type PintRow,
} from './pintMapping';
import { fetchProductBySlug } from './products';
import {
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
  productId?: string | null;
  productSlug?: string | null;
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

export function formatPourLabel(
  pint: Pick<Pint, 'pintType' | 'servingType' | 'productName'>
): string {
  const name = pint.productName ?? pint.pintType;
  const serve = formatServingLabel(pint.servingType);
  return serve ? `${name} · ${serve}` : name;
}

export function resolvePourFilter(preset: PourPresetId): PourFilter {
  switch (preset) {
    case 'guinness-00-draught':
      return {
        preset,
        productSlug: 'guinness-00',
        servingType: 'draught',
        minScore: 8,
        recencyDays: 30,
        maxDistanceKm: 5,
      };
    case 'guinness':
      return {
        preset,
        productSlug: 'guinness',
        servingType: null,
        minScore: 0,
        recencyDays: 30,
        maxDistanceKm: null,
      };
    default:
      return {
        preset: 'all',
        productSlug: null,
        servingType: null,
        minScore: 0,
        recencyDays: null,
        maxDistanceKm: null,
      };
  }
}

export async function findPours(filter: PourFilter): Promise<PourResult[]> {
  let productId = filter.productId ?? null;

  if (!productId && filter.productSlug) {
    const product = await fetchProductBySlug(filter.productSlug);
    productId = product?.id ?? null;
  }

  let query = supabase
    .from('pints')
    .select(PINT_SELECT_WITH_PUB_GEO)
    .order('created_at', { ascending: false });

  if (productId) {
    query = query.eq('product_id', productId);
  } else if (filter.pintType) {
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

  let pints = ((data ?? []) as PintRow[]).map(mapPintRowToPint);

  if (filter.productSlug) {
    pints = pints.filter((pint) => pintMatchesProductSlug(pint, filter.productSlug!));
  }

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
    const pubRel = normalizeRelation(pubRow?.pubs);

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
      return 'Regular Guinness draught and pints near you.';
    default:
      return 'All rated pints, any product.';
  }
}

export function formatPourResultScore(result: PourResult): string {
  return Number.isInteger(result.avgScore)
    ? String(result.avgScore)
    : result.avgScore.toFixed(1);
}
