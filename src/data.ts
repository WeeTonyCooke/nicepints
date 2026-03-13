export type PintType =
  | 'Guinness'
  | "Murphy's"
  | 'Beamish'
  | 'Kilkenny'
  | "Smithwick's"
  | 'Hop House 13'
  | 'Local Craft'
  | 'Other';

export const PINT_TYPES: PintType[] = [
  'Guinness',
  "Murphy's",
  'Beamish',
  'Kilkenny',
  "Smithwick's",
  'Hop House 13',
  'Local Craft',
  'Other',
];

export interface Pint {
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
}

export interface Pub {
  id: string;
  name: string;
  location: string;
  country: string;
  distance?: string;
}

export const FEED_DATA: Pint[] = [
  {
    id: '1',
    user: 'Sean_D',
    pintType: 'Guinness',
    pubName: "Rosato's",
    pubId: 'rosatos-moville',
    location: 'Moville, Co. Donegal',
    country: 'Ireland',
    rating: 5,
    photo: '/rosatos_moville.jpeg',
    note: 'The lacing says it all. A Moville local institution.',
    time: 'Just now',
  },
  {
    id: '2',
    user: 'BostonPint',
    pintType: 'Guinness',
    pubName: "Emmet's",
    pubId: 'emmets-boston',
    location: 'Boston, MA',
    country: 'USA',
    rating: 4.9,
    photo: '/emmets_boston.jpeg',
    note: 'Best pour in Beacon Hill.',
    time: '1h ago',
  },
  {
    id: '3',
    user: 'PintTracker',
    pintType: 'Guinness',
    pubName: "Keogh's",
    pubId: 'keoghs-dublin',
    location: 'Dublin',
    country: 'Ireland',
    rating: 4.9,
    photo: '/keoghs_dublin.jpeg',
    note: 'Classic Dublin pint. Proper settling time respected.',
    time: '2h ago',
  },
  {
    id: '4',
    user: 'SkerriesLocal',
    pintType: 'Guinness',
    pubName: "Joe May's",
    pubId: 'joymays-skerries',
    location: 'Skerries, Co. Dublin',
    country: 'Ireland',
    rating: 4.8,
    photo: '/joymay_skerries.jpeg',
    note: 'Perfect after a walk on the pier.',
    time: '4h ago',
  },
  {
    id: '5',
    user: 'BostonTraveler',
    pintType: 'Guinness',
    pubName: 'McGonagles',
    pubId: 'mcgonagles-boston',
    location: 'Boston, MA',
    country: 'USA',
    rating: 4.7,
    photo: '/mcgonagles_boston.jpeg',
    note: 'Solid Irish pub vibes. Creamy head, good temperature.',
    time: '6h ago',
  },
  {
    id: '6',
    user: 'DonegalGal',
    pintType: 'Guinness',
    pubName: "Susie's Bar",
    pubId: 'susies-moville',
    location: 'Moville, Co. Donegal',
    country: 'Ireland',
    rating: 4.8,
    photo: '/susies_moville.jpeg',
    note: 'Proper settling and perfect temperature. Lovely drop.',
    time: '8h ago',
  },
  {
    id: '7',
    user: 'SouthSide',
    pintType: 'Guinness',
    pubName: 'Sandymount House',
    pubId: 'sandymount-dublin',
    location: 'Dublin',
    country: 'Ireland',
    rating: 4.7,
    photo: '/sandymounthouse_dublin.jpeg',
    note: 'Very creamy head. Hard to beat on a Sunday afternoon.',
    time: 'Yesterday',
  },
  {
    id: '8',
    user: 'CityPint',
    pintType: 'Guinness',
    pubName: 'The Dubliner',
    pubId: 'thedubliner-boston',
    location: 'Boston, MA',
    country: 'USA',
    rating: 4.6,
    photo: '/thedubliner_boston.jpeg',
    note: 'Great spot near Government Center. Spot on pour.',
    time: 'Yesterday',
  },
];

export const NEARBY_PUBS: Pub[] = [
  { id: 'rosatos-moville',    name: "Rosato's",         location: 'Moville, Co. Donegal', country: 'Ireland', distance: '120m' },
  { id: 'susies-moville',     name: "Susie's Bar",      location: 'Moville, Co. Donegal', country: 'Ireland', distance: '340m' },
  { id: 'keoghs-dublin',      name: "Keogh's",          location: 'Dublin',               country: 'Ireland', distance: '0.8km' },
  { id: 'sandymount-dublin',  name: 'Sandymount House', location: 'Dublin',               country: 'Ireland', distance: '1.2km' },
  { id: 'joymays-skerries',   name: "Joe May's",        location: 'Skerries',             country: 'Ireland', distance: '2.1km' },
  { id: 'emmets-boston',      name: "Emmet's",          location: 'Boston, MA',           country: 'USA',     distance: '5,223km' },
  { id: 'mcgonagles-boston',  name: 'McGonagles',       location: 'Boston, MA',           country: 'USA',     distance: '5,231km' },
  { id: 'thedubliner-boston', name: 'The Dubliner',     location: 'Boston, MA',           country: 'USA',     distance: '5,238km' },
];

// Helpers
export function getPintById(id: string): Pint | undefined {
  return FEED_DATA.find(p => p.id === id);
}

export function getPintsByPubId(pubId: string): Pint[] {
  return FEED_DATA.filter(p => p.pubId === pubId);
}

export function getPubRating(pubId: string): number {
  const pints = getPintsByPubId(pubId);
  if (!pints.length) return 0;
  return Math.round((pints.reduce((s, p) => s + p.rating, 0) / pints.length) * 10) / 10;
}
