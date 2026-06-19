import { supabase } from '../supabaseClient';
import type { Pub } from './types';

export type PubSource = 'seed' | 'places' | 'user';

export type PubPlaceCandidate = {
  kind: 'existing' | 'google' | 'manual';
  id?: string;
  googlePlaceId?: string;
  name: string;
  city: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  subtitle?: string;
};

type PubRow = {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  latitude?: number | null;
  longitude?: number | null;
  google_place_id?: string | null;
  source?: string | null;
};

const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY?.trim();

export function isPlacesSearchEnabled(): boolean {
  return !!PLACES_API_KEY;
}

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, '\\$&');
}

function mapPubRowToCandidate(pub: PubRow): PubPlaceCandidate {
  return {
    kind: 'existing',
    id: pub.id,
    name: pub.name,
    city: pub.city ?? 'Unknown',
    country: pub.country ?? 'Ireland',
    latitude: pub.latitude ?? null,
    longitude: pub.longitude ?? null,
    subtitle: [pub.city, pub.country].filter(Boolean).join(', '),
  };
}

export async function searchLocalPubs(query: string, limit = 8): Promise<PubPlaceCandidate[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const pattern = `%${escapeIlike(trimmed)}%`;

  const [byName, byCity] = await Promise.all([
    supabase
      .from('pubs')
      .select('id, name, city, country, latitude, longitude')
      .ilike('name', pattern)
      .order('name', { ascending: true })
      .limit(limit),
    supabase
      .from('pubs')
      .select('id, name, city, country, latitude, longitude')
      .ilike('city', pattern)
      .order('name', { ascending: true })
      .limit(limit),
  ]);

  if (byName.error) {
    throw new Error(`Pub search failed: ${byName.error.message}`);
  }

  if (byCity.error) {
    throw new Error(`Pub search failed: ${byCity.error.message}`);
  }

  const merged = new Map<string, PubRow>();
  for (const row of [...((byName.data ?? []) as PubRow[]), ...((byCity.data ?? []) as PubRow[])]) {
    merged.set(row.id, row);
  }

  return Array.from(merged.values())
    .slice(0, limit)
    .map(mapPubRowToCandidate);
}

type GoogleAutocompleteSuggestion = {
  placePrediction?: {
    placeId?: string;
    structuredFormat?: {
      mainText?: { text?: string };
      secondaryText?: { text?: string };
    };
    text?: { text?: string };
  };
};

type GooglePlaceDetails = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
};

function parseCityFromAddressComponents(
  components: GooglePlaceDetails['addressComponents']
): string {
  if (!components?.length) {
    return 'Unknown';
  }

  const locality =
    components.find((c) => c.types?.includes('locality'))?.longText ??
    components.find((c) => c.types?.includes('postal_town'))?.longText ??
    components.find((c) => c.types?.includes('administrative_area_level_2'))?.longText;

  return locality?.trim() || 'Unknown';
}

function parseCountryFromAddressComponents(
  components: GooglePlaceDetails['addressComponents']
): string {
  if (!components?.length) {
    return 'Ireland';
  }

  return (
    components.find((c) => c.types?.includes('country'))?.longText?.trim() || 'Ireland'
  );
}

export async function fetchGooglePlaceDetails(
  googlePlaceId: string
): Promise<PubPlaceCandidate> {
  if (!PLACES_API_KEY) {
    throw new Error('Google Places is not configured.');
  }

  const response = await fetch(`https://places.googleapis.com/v1/places/${googlePlaceId}`, {
    headers: {
      'X-Goog-Api-Key': PLACES_API_KEY,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,addressComponents',
    },
  });

  if (!response.ok) {
    throw new Error('Could not load place details from Google.');
  }

  const place = (await response.json()) as GooglePlaceDetails;

  return {
    kind: 'google',
    googlePlaceId: place.id ?? googlePlaceId,
    name: place.displayName?.text?.trim() || 'Unknown pub',
    city: parseCityFromAddressComponents(place.addressComponents),
    country: parseCountryFromAddressComponents(place.addressComponents),
    latitude: place.location?.latitude ?? null,
    longitude: place.location?.longitude ?? null,
    subtitle: place.formattedAddress,
  };
}

export async function searchGooglePlaces(query: string): Promise<PubPlaceCandidate[]> {
  if (!PLACES_API_KEY) {
    return [];
  }

  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY,
    },
    body: JSON.stringify({
      input: trimmed,
      includedPrimaryTypes: ['bar', 'restaurant', 'night_club', 'pub'],
      includedRegionCodes: ['ie', 'gb'],
    }),
  });

  if (!response.ok) {
    console.error('Google Places autocomplete failed:', response.status);
    return [];
  }

  const payload = (await response.json()) as {
    suggestions?: GoogleAutocompleteSuggestion[];
  };

  const results: PubPlaceCandidate[] = [];

  for (const suggestion of payload.suggestions ?? []) {
    const prediction = suggestion.placePrediction;
    if (!prediction?.placeId) {
      continue;
    }

    const mainText = prediction.structuredFormat?.mainText?.text?.trim();
    const secondaryText = prediction.structuredFormat?.secondaryText?.text?.trim();

    results.push({
      kind: 'google',
      googlePlaceId: prediction.placeId,
      name: mainText || prediction.text?.text?.trim() || 'Unknown pub',
      city: secondaryText?.split(',')[0]?.trim() || 'Unknown',
      country: 'Ireland',
      subtitle: secondaryText || prediction.text?.text,
    });
  }

  return results.slice(0, 6);
}

export async function searchPubCandidates(query: string): Promise<PubPlaceCandidate[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const [local, google] = await Promise.all([
    searchLocalPubs(trimmed),
    searchGooglePlaces(trimmed),
  ]);

  const seenGoogleIds = new Set<string>();
  const seenNames = new Set(local.map((p) => p.name.toLowerCase()));

  const googleFiltered = google.filter((candidate) => {
    if (!candidate.googlePlaceId || seenGoogleIds.has(candidate.googlePlaceId)) {
      return false;
    }
    seenGoogleIds.add(candidate.googlePlaceId);
    return !seenNames.has(candidate.name.toLowerCase());
  });

  return [...local, ...googleFiltered];
}

export type UpsertPubInput = {
  name: string;
  city: string;
  country: string;
  googlePlaceId?: string | null;
  source: PubSource;
  latitude?: number | null;
  longitude?: number | null;
};

async function findPubByGooglePlaceId(googlePlaceId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('pubs')
    .select('id')
    .eq('google_place_id', googlePlaceId)
    .maybeSingle();

  if (error) {
    if (error.code === '42703' || error.message.includes('google_place_id')) {
      return null;
    }
    throw new Error(error.message);
  }

  return data?.id ?? null;
}

export async function upsertPubFromPlace(input: UpsertPubInput): Promise<string> {
  const trimmedName = input.name.trim();
  const trimmedCity = input.city.trim();

  if (!trimmedName || !trimmedCity) {
    throw new Error('Pub name and city are required.');
  }

  if (input.googlePlaceId) {
    const existingId = await findPubByGooglePlaceId(input.googlePlaceId);
    if (existingId) {
      return existingId;
    }
  }

  const row: Record<string, unknown> = {
    name: trimmedName,
    city: trimmedCity,
    country: input.country.trim() || 'Ireland',
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    source: input.source,
  };

  if (input.googlePlaceId) {
    row.google_place_id = input.googlePlaceId;
  }

  const { data, error } = await supabase.from('pubs').insert(row).select('id').single();

  if (error) {
    if (input.googlePlaceId) {
      const existingId = await findPubByGooglePlaceId(input.googlePlaceId);
      if (existingId) {
        return existingId;
      }
    }

    if (error.code === '42501') {
      throw new Error(
        'Could not add this pub. Run supabase/migrations/20250623000000_places_and_account_deletion.sql and sign in.'
      );
    }

    throw new Error(`Could not add pub: ${error.message}`);
  }

  return (data as { id: string }).id;
}

export async function resolvePubIdFromCandidate(
  candidate: PubPlaceCandidate
): Promise<string> {
  if (candidate.kind === 'existing' && candidate.id) {
    return candidate.id;
  }

  let resolved = candidate;

  if (candidate.kind === 'google' && candidate.googlePlaceId) {
    const existingId = await findPubByGooglePlaceId(candidate.googlePlaceId);
    if (existingId) {
      return existingId;
    }

    try {
      resolved = await fetchGooglePlaceDetails(candidate.googlePlaceId);
    } catch (err) {
      console.warn('Place details fetch failed, using autocomplete data:', err);
    }
  }

  return upsertPubFromPlace({
    name: resolved.name,
    city: resolved.city,
    country: resolved.country,
    googlePlaceId: resolved.googlePlaceId ?? null,
    source: resolved.kind === 'google' ? 'places' : 'user',
    latitude: resolved.latitude ?? null,
    longitude: resolved.longitude ?? null,
  });
}

export async function fetchPubById(pubId: string): Promise<Pub | null> {
  const { data, error } = await supabase
    .from('pubs')
    .select('id, name, city, country, latitude, longitude')
    .eq('id', pubId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load pub: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const pub = data as PubRow;
  return {
    id: pub.id,
    name: pub.name,
    location: pub.city ?? 'Unknown',
    country: pub.country ?? 'Ireland',
    distance: '',
    latitude: pub.latitude ?? null,
    longitude: pub.longitude ?? null,
  };
}
