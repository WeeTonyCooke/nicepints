const SAGE_THRESHOLD = 7;
const RUST_THRESHOLD = 5;

export type RatingTone = 'sage' | 'rust' | 'neutral';

export function getRatingTone(score: number): RatingTone {
  if (score >= SAGE_THRESHOLD) {
    return 'sage';
  }

  if (score < RUST_THRESHOLD) {
    return 'rust';
  }

  return 'neutral';
}

export function ratingTextClass(score: number): string {
  const tone = getRatingTone(score);

  if (tone === 'sage') {
    return 'text-sage';
  }

  if (tone === 'rust') {
    return 'text-rust';
  }

  return 'text-cream';
}

export function ratingPillClass(score: number): string {
  const tone = getRatingTone(score);

  if (tone === 'sage') {
    return 'bg-sage text-stout';
  }

  if (tone === 'rust') {
    return 'bg-rust text-stout';
  }

  return 'bg-cream text-stout';
}

export function ratingChipClass(score: number): string {
  const tone = getRatingTone(score);

  if (tone === 'sage') {
    return 'text-sage bg-sage-tint';
  }

  if (tone === 'rust') {
    return 'text-rust bg-rust-tint';
  }

  return 'text-cream bg-graphite';
}
