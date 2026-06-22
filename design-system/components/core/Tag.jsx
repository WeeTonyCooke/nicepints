import React from 'react';

const TONES = {
  neutral: { bg: 'var(--graphite)', fg: 'var(--muted)', bd: 'var(--line)' },
  cream:   { bg: 'var(--graphite)', fg: 'var(--cream)', bd: 'var(--line)' },
  gold:    { bg: 'var(--gold-soft)', fg: 'var(--gold)', bd: 'var(--gold)' },
  sage:    { bg: 'var(--sage-tint)', fg: 'var(--sage)', bd: 'var(--line)' },
  rust:    { bg: 'var(--rust-tint)', fg: 'var(--rust)', bd: 'var(--line)' },
};

/**
 * Small status / meta tag. Uppercase, tracked, pill or chip radius.
 * For drink categories use <DrinkChip> instead (it carries the accent system).
 */
export function Tag({ children, tone = 'neutral', pill = true, style = {} }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: t.bg,
      color: t.fg,
      border: `1px solid ${t.bd}`,
      borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-chip)',
      padding: '4px 10px',
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
