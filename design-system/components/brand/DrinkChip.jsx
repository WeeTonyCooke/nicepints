import React from 'react';

const ACCENTS = {
  guinness:      'var(--drink-guinness)',
  'guinness-00': 'var(--drink-guinness-00)',
  beamish:       'var(--drink-beamish)',
  murphys:       'var(--drink-murphys)',
};

/**
 * Drink-category chip — the one place the drink-type accent system appears
 * (DESIGN-PRINCIPLES §6). 3px left border + text in the accent colour, on a
 * graphite chip. Never apply the accent to backgrounds, scrims, or photos.
 */
export function DrinkChip({ slug = 'other', children, style = {} }) {
  const accent = ACCENTS[slug] ?? 'var(--drink-other)';
  return (
    <span style={{
      display: 'inline-block',
      background: 'var(--graphite)',
      border: '1px solid var(--line)',
      borderLeft: `3px solid ${accent}`,
      color: accent,
      padding: '4px 9px',
      borderRadius: 'var(--radius-chip)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-micro)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1,
      ...style,
    }}>
      {children}
    </span>
  );
}
