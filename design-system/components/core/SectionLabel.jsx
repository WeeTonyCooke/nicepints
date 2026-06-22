import React from 'react';

/**
 * Uppercase section divider — small tracked label, a hairline rule, and an
 * optional right-aligned count. Used for "Latest · 12 pints" feed dividers.
 */
export function SectionLabel({ children, count = null, style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', ...style }}>
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-label)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-label)',
        color: 'var(--muted)',
        whiteSpace: 'nowrap',
      }}>
        {children}
      </span>
      <span style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
      {count != null && (
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-micro)', fontWeight: 500, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {count}
        </span>
      )}
    </div>
  );
}
