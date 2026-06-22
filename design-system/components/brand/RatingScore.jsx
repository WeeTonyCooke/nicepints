import React from 'react';

/** Tone by score band — matches utils/ratingColor in the app. */
export function ratingTone(score) {
  if (score >= 9) return 'var(--rating-gold)';
  if (score >= 8) return 'var(--rating-amber)';
  if (score >= 7) return 'var(--rating-copper)';
  return 'var(--rating-stone)';
}

const SIZES = {
  sm: { padding: '3px 8px',  fontSize: '10px' },
  md: { padding: '5px 10px', fontSize: '12px' },
  lg: { padding: '6px 12px', fontSize: '18px' },
};

/**
 * Compact rating pill — translucent dark backdrop with blur, score coloured
 * by band. Sits over photos (e.g. on Find-a-Pint result cards). Shows `/10`.
 * For the large hero/feed numeral use <EditorialRatingBlock>.
 */
export function RatingScore({ score, size = 'md', showMax = true, style = {} }) {
  const s = SIZES[size] ?? SIZES.md;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
      color: ratingTone(score),
      background: 'rgba(0,0,0,0.55)',
      border: '1px solid rgba(243,239,230,0.10)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-sm)',
      ...s,
      ...style,
    }}>
      {score.toFixed(1)}{showMax ? '/10' : ''}
    </span>
  );
}
