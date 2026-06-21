import {
  FALLBACK_PHOTO_URL,
  PINT_TYPES,
  type Pint,
  type PintType,
  type Product,
  type ProductCategory,
  type ServingType,
} from './types';

export type PubRelation = {
  name: string | null;
  city: string | null;
  country: string | null;
  latitude?: number | null;
  longitude?: number | null;
  id?: string | null;
};

export type ProductRelation = {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  category?: ProductCategory | null;
  country_of_origin?: string | null;
  is_non_alcoholic: boolean;
  active: boolean;
};

export type PintRow = {
  id: string;
  pub_id: string | null;
  user_name: string | null;
  score: number | string | null;
  caption: string | null;
  photo_url: string | null;
  created_at: string | null;
  pint_type: string | null;
  serving_type?: string | null;
  product_id?: string | null;
  products?: ProductRelation | ProductRelation[] | null;
  pubs?: PubRelation | PubRelation[] | null;
};

export const PINT_SELECT = `
  id,
  pub_id,
  user_name,
  score,
  caption,
  photo_url,
  created_at,
  pint_type,
  serving_type,
  product_id,
  products (
    id,
    slug,
    name,
    brand,
    category,
    country_of_origin,
    is_non_alcoholic,
    active
  ),
  pubs (
    name,
    city,
    country
  )
`;

export const PINT_SELECT_WITH_PUB_GEO = `
  id,
  pub_id,
  user_name,
  score,
  caption,
  photo_url,
  created_at,
  pint_type,
  serving_type,
  product_id,
  products (
    id,
    slug,
    name,
    brand,
    category,
    country_of_origin,
    is_non_alcoholic,
    active
  ),
  pubs (
    id,
    name,
    city,
    country,
    latitude,
    longitude
  )
`;

export function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString();
}

function coerceServingType(value: string | null | undefined): ServingType {
  if (value === 'draught' || value === 'can' || value === 'bottle') {
    return value;
  }

  return 'unknown';
}

function coercePintType(value: string | null, productName?: string | null): PintType {
  const candidate = productName ?? value;
  if (candidate && PINT_TYPES.includes(candidate as PintType)) {
    return candidate as PintType;
  }

  return 'Guinness';
}

export function mapProductRelation(relation: ProductRelation | null): Product | null {
  if (!relation) {
    return null;
  }

  return {
    id: relation.id,
    slug: relation.slug,
    name: relation.name,
    brand: relation.brand ?? undefined,
    category: relation.category ?? undefined,
    countryOfOrigin: relation.country_of_origin ?? undefined,
    isNonAlcoholic: relation.is_non_alcoholic,
    active: relation.active,
  };
}

export function mapPintRowToPint(pint: PintRow): Pint {
  const pub = normalizeRelation(pint.pubs);
  const product = normalizeRelation(pint.products);
  const productName = product?.name ?? pint.pint_type ?? 'Unknown Drink';

  return {
    id: pint.id,
    user: pint.user_name ?? 'Anonymous',
    pintType: coercePintType(pint.pint_type, product?.name),
    productId: pint.product_id ?? product?.id ?? null,
    productSlug: product?.slug ?? null,
    productName,
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

export const LEGACY_PINT_TYPE_BY_SLUG: Record<string, string> = {
  guinness: 'Guinness',
  'guinness-00': 'Guinness 0.0',
  beamish: 'Beamish',
  murphys: "Murphy's",
  other: 'Other',
};

export function pintMatchesProductSlug(
  pint: Pick<Pint, 'productId' | 'productSlug' | 'pintType'>,
  productSlug: string
): boolean {
  if (pint.productSlug === productSlug) {
    return true;
  }

  if (pint.productId) {
    return false;
  }

  const legacyName = LEGACY_PINT_TYPE_BY_SLUG[productSlug];
  return legacyName ? pint.pintType === legacyName : false;
}
