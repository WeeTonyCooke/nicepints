const GOLD_THRESHOLD = 9;
const AMBER_THRESHOLD = 8;
const COPPER_THRESHOLD = 7;

export type RatingTone = 'gold' | 'amber' | 'copper' | 'stone';

export function getRatingTone(score: number): RatingTone {
  if (score >= GOLD_THRESHOLD) {
    return 'gold';
  }

  if (score >= AMBER_THRESHOLD) {
    return 'amber';
  }

  if (score >= COPPER_THRESHOLD) {
    return 'copper';
  }

  return 'stone';
}

export function ratingTextClass(score: number): string {
  const tone = getRatingTone(score);

  if (tone === 'gold') {
    return 'text-rating-gold';
  }

  if (tone === 'amber') {
    return 'text-rating-amber';
  }

  if (tone === 'copper') {
    return 'text-rating-copper';
  }

  return 'text-rating-stone';
}

export function ratingPillClass(score: number): string {
  return `bg-black/55 border border-cream/10 backdrop-blur-sm shadow-sm ${ratingTextClass(score)}`;
}

export function ratingChipClass(score: number): string {
  const tone = getRatingTone(score);

  if (tone === 'gold') {
    return 'text-rating-gold bg-gold-soft/70';
  }

  if (tone === 'amber') {
    return 'text-rating-amber bg-[#2F2314]';
  }

  if (tone === 'copper') {
    return 'text-rating-copper bg-rust-tint';
  }

  return 'text-rating-stone bg-graphite';
}
