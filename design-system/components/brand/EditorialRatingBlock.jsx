import React from 'react';

function verdict(score) {
  if (score >= 9) return 'Exceptional';
  if (score >= 8.5) return 'Excellent';
  if (score >= 7.5) return 'Very Good';
  if (score >= 6.5) return 'Good';
  return null;
}

const SIZES = { feed: '3rem', hero: '3.5rem' };
const RULE = { feed: '86%', hero: '88%' };

/**
 * The editorial rating block — the largest element on a feed/hero card.
 * Big Playfair numeral with the fraction as a superscript, a gold hairline
 * rule, and a one-word verdict (shown at 6.5+). Designed to sit over a photo.
 */
export function EditorialRatingBlock({ score, size = 'feed', style = {} }) {
  const formatted = score.toFixed(1);
  const dot = formatted.indexOf('.');
  const whole = formatted.slice(0, dot);
  const frac = formatted.slice(dot);
  const v = verdict(score);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', ...style }}>
      <div style={{ display: 'inline-block', maxWidth: '100%' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: 'var(--np-cream)',
          textShadow: 'var(--shadow-score)',
          fontSize: SIZES[size] ?? SIZES.feed,
        }} aria-label={`${formatted} out of 10`}>
          <span style={{ whiteSpace: 'nowrap' }}>
            {whole}
            <span style={{ fontSize: '0.34em', verticalAlign: '0.2em', marginLeft: '-0.03em', fontWeight: 700 }}>{frac}</span>
          </span>
        </div>
        <span aria-hidden="true" style={{ display: 'block', height: '1px', background: 'var(--np-gold)', marginTop: '6px', marginLeft: 'auto', width: RULE[size] ?? RULE.feed }} />
      </div>
      {v && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500, color: 'var(--np-cream)', marginTop: '16px', letterSpacing: '0.01em', textShadow: 'var(--shadow-score)' }}>
          {v}
        </p>
      )}
    </div>
  );
}
