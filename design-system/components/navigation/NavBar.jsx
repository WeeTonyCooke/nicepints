import React from 'react';

/* Inlined Lucide-style stroke icons (the app uses lucide-react). */
const Icon = ({ d, size = 20, strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    {d}
  </svg>
);

export const NavIcons = {
  feed: <Icon d={<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />} />,           // Activity
  find: <Icon d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>} />, // MapPin
  profile: <Icon d={<><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></>} />, // User
};

const PlusIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/**
 * Bottom navigation — a floating graphite pill with three tabs and a raised
 * gold "+" action lifted above the centre. Active tab is gold. Mobile-first;
 * sits inside a max-width mobile column.
 */
export function NavBar({ active = 'feed', onNavigate = () => {}, onAdd = () => {} }) {
  const TABS = [
    { id: 'feed', label: 'Feed', icon: NavIcons.feed },
    { id: 'find', label: 'Find', icon: NavIcons.find },
    { id: 'profile', label: 'Profile', icon: NavIcons.profile },
  ];

  const tabStyle = (isActive) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isActive ? 'var(--gold)' : 'var(--muted)',
    transition: 'color var(--dur-base)',
    WebkitTapHighlightColor: 'transparent',
  });

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: '64px', background: 'rgba(30,27,23,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-nav)', overflow: 'visible' }}>
      <button type="button" style={tabStyle(active === 'feed')} onClick={() => onNavigate('feed')}>
        {TABS[0].icon}
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em' }}>Feed</span>
      </button>

      <button type="button" style={tabStyle(active === 'find')} onClick={() => onNavigate('find')}>
        {TABS[1].icon}
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em' }}>Find</span>
      </button>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <button type="button" onClick={onAdd} aria-label="Log a pint"
          style={{ width: '48px', height: '48px', marginTop: '-32px', background: 'var(--gold)', color: 'var(--stout)', borderRadius: 'var(--radius-pill)', border: 'none', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform var(--dur-fast) var(--ease-standard)' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
          {PlusIcon}
        </button>
      </div>

      <button type="button" style={tabStyle(active === 'profile')} onClick={() => onNavigate('profile')}>
        {TABS[2].icon}
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.02em' }}>Profile</span>
      </button>
    </div>
  );
}
