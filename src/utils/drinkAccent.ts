/**
 * Drink-type accent colours for category label chips only (see DESIGN-PRINCIPLES §6).
 * Keyed by product slug — not stored in the database.
 */
const DRINK_ACCENTS: Record<string, { border: string; text: string }> = {
  guinness: { border: 'border-l-drink-guinness', text: 'text-drink-guinness' },
  'guinness-00': { border: 'border-l-drink-guinness-00', text: 'text-drink-guinness-00' },
  beamish: { border: 'border-l-drink-beamish', text: 'text-drink-beamish' },
  murphys: { border: 'border-l-drink-murphys', text: 'text-drink-murphys' },
};

const FALLBACK = { border: 'border-l-drink-other', text: 'text-drink-other' };

export function drinkAccentClasses(productSlug?: string | null): string {
  const accent = (productSlug && DRINK_ACCENTS[productSlug]) || FALLBACK;
  return `border-l-[3px] ${accent.border} ${accent.text}`;
}
