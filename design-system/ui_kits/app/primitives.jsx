const { useState } = React;
const PINTS = window.NP_PINTS;
const FLAG = window.NP_FLAG;

/* ---------- brand primitives ---------- */
function PintMark({ size = 26 }) {
  return (
    <svg viewBox="0 0 100 189.2" width={size} height={size * 1.892} style={{ display: 'block', flexShrink: 0 }} aria-hidden="true">
      <path d="M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z" fill="#F2E9D8" />
      <path d="M0 37.84 L20 37.84 L27.57 37.84 L28.11 38.38 L41.62 38.38 L42.16 38.92 L58.92 38.92 L59.46 38.38 L70.81 38.38 L71.35 37.84 L78.92 37.84 L79.46 37.3 L99.46 37.3 L99.46 54.05 L97.84 67.03 L95.14 80 L88.11 102.7 L82.7 134.05 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L16.76 134.05 L11.89 105.41 L4.32 80 L1.62 67.57 L0 54.59 Z" fill="#1B1815" />
      <path d="M64.32 0 L84.32 2.16 L90.81 3.78 L92.97 5.41 L98.38 25.95 L99.46 35.14 L99.46 54.05 L96.22 75.14 L88.11 102.7 L83.24 129.19 L81.62 155.68 L82.7 166.49 L84.32 172.97 L84.32 181.08 L83.24 183.24 L79.46 185.95 L72.97 187.57 L61.62 188.65 L37.84 188.65 L21.62 186.49 L18.38 184.86 L15.14 180.54 L14.59 175.68 L17.3 162.16 L17.3 140.54 L16.22 129.19 L11.89 105.41 L3.24 75.68 L0 54.59 L0.54 30.27 L2.16 20.54 L6.49 5.95 L9.73 3.78 L16.22 2.16 L37.3 0 Z" fill="none" stroke="#F2E9D8" strokeWidth="3.2" strokeLinejoin="round" />
    </svg>
  );
}

function Wordmark({ size = 'header', icon }) {
  const withIcon = icon ?? size === 'header';
  if (size === 'compact')
    return <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--muted)' }}>Nice Pints</span>;
  const fs = size === 'display' ? '30px' : '20px';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      {withIcon && <PintMark size={size === 'display' ? 22 : 16} />}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: fs, letterSpacing: '-0.02em', color: 'var(--cream)', lineHeight: 1 }}>
        Nice <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Pints</span>
      </span>
    </span>
  );
}

const ACCENT = { guinness: 'var(--drink-guinness)', 'guinness-00': 'var(--drink-guinness-00)', beamish: 'var(--drink-beamish)', murphys: 'var(--drink-murphys)' };
function DrinkChip({ slug, children, style }) {
  const a = ACCENT[slug] || 'var(--drink-other)';
  return <span style={{ display: 'inline-block', whiteSpace: 'nowrap', background: 'var(--graphite)', border: '1px solid var(--line)', borderLeft: `3px solid ${a}`, color: a, padding: '4px 9px', borderRadius: '4px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1, ...style }}>{children}</span>;
}

function tone(s) { return s >= 9 ? 'var(--rating-gold)' : s >= 8 ? 'var(--rating-amber)' : s >= 7 ? 'var(--rating-copper)' : 'var(--rating-stone)'; }

function RatingPill({ score, size = 'md' }) {
  const S = { sm: ['3px 8px', '10px'], md: ['5px 10px', '12px'], lg: ['7px 14px', '22px'] }[size];
  return <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: tone(score), background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(243,239,230,0.10)', backdropFilter: 'blur(4px)', borderRadius: '9999px', padding: S[0], fontSize: S[1] }}>{score.toFixed(1)}/10</span>;
}

function verdict(s) { return s >= 9 ? 'Exceptional' : s >= 8.5 ? 'Excellent' : s >= 7.5 ? 'Very Good' : s >= 6.5 ? 'Good' : null; }
function EditorialScore({ score, size = 'feed' }) {
  const f = score.toFixed(1); const d = f.indexOf('.');
  const v = verdict(score);
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--np-cream)', textShadow: 'var(--shadow-score)', fontSize: size === 'hero' ? '3.5rem' : '3rem' }}>
          <span style={{ whiteSpace: 'nowrap' }}>{f.slice(0, d)}<span style={{ fontSize: '0.34em', verticalAlign: '0.2em', marginLeft: '-0.03em' }}>{f.slice(d)}</span></span>
        </div>
        <span style={{ display: 'block', height: '1px', background: 'var(--np-gold)', marginTop: '6px', marginLeft: 'auto', width: size === 'hero' ? '88%' : '86%' }} />
      </div>
      {v && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 500, color: 'var(--np-cream)', marginTop: '14px', textShadow: 'var(--shadow-score)' }}>{v}</p>}
    </div>
  );
}

function Avatar({ name, size = 24 }) {
  return <span style={{ width: size, height: size, borderRadius: '9999px', background: 'var(--elevated)', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span style={{ fontSize: size * 0.38, fontWeight: 700, color: 'var(--cream)' }}>{name.slice(0, 2).toUpperCase()}</span></span>;
}
function Author({ name, founding }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>logged by {name}{founding && <span title="Founding Taster" style={{ color: 'var(--gold)', fontSize: '10px' }}>{'\u2737'}</span>}</span>;
}

/* ---------- icons ---------- */
const I = {
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  pin: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
  nav: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>,
  back: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>,
  feed: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  find: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></svg>,
  plus: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>,
  flag: <svg width="3" height="3" />,
};

const Scrim = () => <><div className="np-photo-scrim-base" style={{ position: 'absolute', inset: 0 }} /><div className="np-photo-scrim-gradient" style={{ position: 'absolute', inset: 0 }} /></>;

window.NP = { PintMark, Wordmark, DrinkChip, RatingPill, EditorialScore, Avatar, Author, tone, I, Scrim, PINTS, FLAG };
