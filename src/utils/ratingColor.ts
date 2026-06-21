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
    return 'text-[#D8B33F]';
  }

  if (tone === 'amber') {
    return 'text-[#C98A2E]';
  }

  if (tone === 'copper') {
    return 'text-[#A55A32]';
  }

  return 'text-[#D8D0BE]';
}

export function ratingPillClass(score: number): string {
  return `bg-black/55 border border-cream/10 backdrop-blur-sm shadow-sm ${ratingTextClass(score)}`;
}

export function ratingChipClass(score: number): string {
  const tone = getRatingTone(score);

  if (tone === 'gold') {
    return 'text-[#D8B33F] bg-gold-soft/70';
  }

  if (tone === 'amber') {
    return 'text-[#C98A2E] bg-[#2F2314]';
  }

  if (tone === 'copper') {
    return 'text-[#A55A32] bg-rust-tint';
  }

  return 'text-[#D8D0BE] bg-graphite';
}
