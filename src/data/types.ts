export const PINT_TYPES = [
  'Guinness',
  'Guinness 0.0',
  'Beamish',
  'Murphy’s',
  'Other',
] as const;

export type PintType = (typeof PINT_TYPES)[number];

export const SERVING_TYPES = ['draught', 'can', 'bottle', 'unknown'] as const;
export type ServingType = (typeof SERVING_TYPES)[number];

export type Pub = {
  id: string;
  name: string;
  location: string;
  country: string;
  distance: string;
  latitude: number | null;
  longitude: number | null;
};

export type Pint = {
  id: string;
  user: string;
  pintType: PintType;
  servingType: ServingType;
  pubName: string;
  pubId: string;
  location: string;
  country: string;
  rating: number;
  photo: string;
  note: string;
  time: string;
  createdAt?: string | null;
};

export const FALLBACK_PHOTO_URL =
  'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80';
