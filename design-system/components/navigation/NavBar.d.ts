import React from 'react';

export interface NavBarProps {
  /** Active tab id. */
  active?: 'feed' | 'find' | 'profile';
  /** Tab tap handler — receives the tab id. */
  onNavigate?: (id: 'feed' | 'find' | 'profile') => void;
  /** Raised gold "+" handler. */
  onAdd?: () => void;
}

/** Inlined stroke icons used by the nav (feed / find / profile). */
export const NavIcons: Record<'feed' | 'find' | 'profile', React.ReactNode>;

/**
 * Floating bottom nav pill — three tabs + raised gold add action.
 * @startingPoint section="Navigation" subtitle="Bottom nav pill with center add" viewport="700x140"
 */
export function NavBar(props: NavBarProps): JSX.Element;
