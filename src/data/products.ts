import { supabase } from '../supabaseClient';
import type { Product, ProductCategory } from './types';

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: ProductCategory | null;
  country_of_origin: string | null;
  is_non_alcoholic: boolean;
  active: boolean;
};

type ProductRegionRow = {
  popularity_score: number;
  products: ProductRow | ProductRow[] | null;
};

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand ?? undefined,
    category: row.category ?? undefined,
    countryOfOrigin: row.country_of_origin ?? undefined,
    isNonAlcoholic: row.is_non_alcoholic,
    active: row.active,
  };
}

function normalizeProductRelation(value: ProductRow | ProductRow[] | null): ProductRow | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function fetchActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, brand, category, country_of_origin, is_non_alcoholic, active')
    .eq('active', true)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Failed to load products: ${error.message}`);
  }

  return ((data ?? []) as ProductRow[]).map(mapProductRow);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, brand, category, country_of_origin, is_non_alcoholic, active')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load product: ${error.message}`);
  }

  return data ? mapProductRow(data as ProductRow) : null;
}

export async function fetchFeaturedProducts(
  countryCode = 'IE',
  limit = 7
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('product_regions')
    .select(`
      popularity_score,
      products (
        id,
        slug,
        name,
        brand,
        category,
        country_of_origin,
        is_non_alcoholic,
        active
      )
    `)
    .eq('country_code', countryCode.toUpperCase())
    .eq('active', true)
    .order('popularity_score', { ascending: false })
    .limit(limit);

  if (error) {
    if (error.code === '42P01' || error.message.includes('product_regions')) {
      return fetchActiveProducts().then((products) => products.slice(0, limit));
    }

    throw new Error(`Failed to load featured products: ${error.message}`);
  }

  const featured = ((data ?? []) as ProductRegionRow[])
    .map((row) => normalizeProductRelation(row.products))
    .filter((row): row is ProductRow => !!row && row.active)
    .map(mapProductRow);

  if (featured.length > 0) {
    return featured;
  }

  return fetchActiveProducts().then((products) => products.slice(0, limit));
}

export async function fetchRecentProductsForUser(
  userId: string,
  limit = 3
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('pints')
    .select(`
      created_at,
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
      )
    `)
    .eq('user_id', userId)
    .not('product_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    if (error.code === '42703') {
      return [];
    }

    throw new Error(`Failed to load recent products: ${error.message}`);
  }

  const seen = new Set<string>();
  const recent: Product[] = [];

  for (const row of data ?? []) {
    const productRow = normalizeProductRelation(
      (row as { products?: ProductRow | ProductRow[] | null }).products ?? null
    );

    if (!productRow || !productRow.active || seen.has(productRow.id)) {
      continue;
    }

    seen.add(productRow.id);
    recent.push(mapProductRow(productRow));

    if (recent.length >= limit) {
      break;
    }
  }

  return recent;
}

export function productRequiresServingType(product: Product): boolean {
  return product.isNonAlcoholic;
}

export function productShowsServingType(product: Product): boolean {
  return product.isNonAlcoholic || product.category === 'stout';
}
