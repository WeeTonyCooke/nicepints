import React from 'react';

/** The canonical Nice Pints pint-glass mark, inlined so it needs no asset path.
 *  Cream head, warm-black body, white settle line. Guinness taper, no base line. */
export function PintMark({ size = 26, style = {} }) {
  return (
    <svg viewBox="0 0 100 189.2" width={size} height={(size * 189.2) / 100} style={{ display: 'block', flexShrink: 0, ...style }} role="img" aria-label="Nice Pints">
      <path d="M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z" fill="#F2E9D8" />
      <path d="M0 37.84 L20 37.84 L27.57 37.84 L28.11 38.38 L41.62 38.38 L42.16 38.92 L58.92 38.92 L59.46 38.38 L70.81 38.38 L71.35 37.84 L78.92 37.84 L79.46 37.3 L99.46 37.3 L99.46 54.05 L97.84 67.03 L95.14 80 L88.11 102.7 L82.7 134.05 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L16.76 134.05 L11.89 105.41 L4.32 80 L1.62 67.57 L0 54.59 Z" fill="#1B1815" />
      <path d="M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z" fill="none" stroke="#F2E9D8" strokeWidth="3.2" strokeLinejoin="round" />
    </svg>
  );
}

const SIZES = {
  header:  { fontSize: '20px', icon: 17 },
  page:    { fontSize: '24px', icon: 20 },
  display: { fontSize: '30px', icon: 25 },
};

/**
 * Nice Pints wordmark. Playfair black; "Pints" set gold italic. An optional
 * pint mark leads the lockup (default on for the `header` size).
 */
export function BrandWordmark({ size = 'header', showIcon, as: Tag = 'span', style = {} }) {
  const s = SIZES[size] ?? SIZES.header;
  const withIcon = showIcon ?? size === 'header';

  if (size === 'compact') {
    return (
      <Tag style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)', color: 'var(--muted)', lineHeight: 1, ...style }}>
        Nice Pints
      </Tag>
    );
  }

  return (
    <Tag style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', ...style }}>
      {withIcon && <PintMark size={s.icon} />}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: s.fontSize, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--cream)' }}>
        Nice <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Pints</span>
      </span>
    </Tag>
  );
}
